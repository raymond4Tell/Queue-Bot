using System;

/* Workflow runs in two (async?) loops. Probably just functions
 * on a service; users can add/modify jobs, service automatically pops jobs.
 * Would be cool to make this as an event system that everybody subscribes to;
 * GUI sends event adding new customer, which JobQueue picks up on and updates itself, then
 * sends an event indicating to everybody else that JobQueue is new. OTOH, how much benefit
 * would that really give over current?
 * 
 * 1. Add jobs to PQueue. Jobs have jobName, Owner (with name and
 * time-value), jobDuration, time enqueued, and balance. Last two may belong
 * to owner instead of job. Adding job will also require updating
 * ordering, and therefore BEWT and each job's balance. 
 * 2. Remove jobs from PQueue, with payment and at proper time.
 * Am uncertain whether to handle this as operator requesting
 * next job, or service sending job to operator. Probably best
 * to send from service.
 * 
 * Alternate structure: Queue of persons that have job fields.
 * Also allows for limited list of possible jobs, useful for controlling user input.
 * 
 * Desired sorting order: Minimize value of total time spent in queue across all users.
 * IE, person Alpha worth $20/hr who spends 4 hours waiting to be served
 * and person Bravo worth $15 who waits 20 minutes have a combined wait-time-value of $85.
 * Best method is probably O(n!) combinatorial brute force, or something cunning in dynamic programming.
 * Simplest and current is just sorting on timeValue/jobDuration, so busy customers
 * and quick jobs get sorted first, regardless of actual time in queue.
 * 
 * Technical issue: Need PQueue that maintains internal sorted order, not just heap.
 * Best option is probably something based on SortedList. Later worry, though. Right now,
 * focus is on getting Angular frontend set up.
 * 
 * Break-Even Wait Time calculation: Balance = sum (timeValue * (timeWaiting - BEWT))
 * BEWT is the "average" wait time, so that
 * (payments from people who wait less than BEWT) + (payments to people who wait longer than BEWT) = Balance on computer.
 * Balance is initially 0, but will change as people leave the queue and pay/get paid for their wait.
 * May also change over time due to the cost of operating this service; bandwidth costs, electricity, ETC.
 * 
 * Consistency issue: What's a negative MachineBalance mean? Means machine owes money, yes? Doesn't much matter which
 * we go with, but for the love of God, keep it consistent.
 */
namespace Queue_Bot
{
    public static class Program
    {
        public static readonly IPriorityQueue<Customer> JobQueue = new PriorityQueue<Customer>();
        public static double MachineBalance = 0.0;
        public static TimeSpan BEWT = TimeSpan.Zero;
        public static Job[] jobList = { new Job(new TimeSpan(2, 0, 0) , "Rotate tires"), 
                new Job(TimeSpan.FromHours(.5), "Hoover the roof") ,
            new Job(new TimeSpan(1, 40, 0),  "Square the circle"),
            new Job(new TimeSpan(2, 30,0),  "Empty liquor cabinet"),
            new Job(new TimeSpan(3, 0,0), "Destroy watermelons")
            };

        public static void Main()
        {
            if (JobQueue.Count == 0)
            {
                //Initialization.
                JobQueue.Clear();
                var bob = new Customer("Bob", 1.2, jobList[0]);
                AddCustomer(bob);
                AddCustomer(new Customer("Ethel", 1.5, jobList[1]));
                AddCustomer(new Customer("Alfred", 1.91, jobList[3]));
                AddCustomer(new Customer("Jasmine", 2.17, jobList[2]));
            }
            foreach (var tempCustomer in JobQueue)
            {
                Console.WriteLine(tempCustomer.ToString());
                var tempBalance = tempCustomer.FindBalance(BEWT);
                Console.WriteLine(tempBalance > 0 ? "Customer is owed: {0:C2}" : "Customer owes: {0:C2}", tempBalance);
                Console.WriteLine("--------------------------");
            }
        }

        /// <summary>
        /// Extension method, used for rounding times for display.
        /// While computers may appreciate millisecond-accuracy, I
        /// prefer slightly rounder time.
        /// </summary>
        /// <example>DateTime nowTrimmedToSeconds = now.Trim(TimeSpan.TicksPerSecond);</example>
        /// <param name="date">Date to trim</param>
        /// <param name="ticks">ticks per round unit.</param>
        /// <returns></returns>
        public static DateTime Trim(this DateTime date, long ticks)
        {
            return new DateTime(date.Ticks - (date.Ticks % ticks));
        }
        /// <summary>
        /// Cousin of the above, used for trimming TimeSpans
        /// </summary>
        /// <param name="duration">TimeSpan to trim</param>
        /// <param name="ticks">Ticks per round unit.</param>
        /// <returns></returns>
        public static TimeSpan Trim(this TimeSpan duration, long ticks)
        {
            return new TimeSpan(duration.Ticks - (duration.Ticks % ticks));
        }

        /// <summary>
        /// Encapsulates jobQueue, so we don't have to interface with it directly, and can replace it as needed.
        /// Also consolidates the boilerplate involved in object addition, so we don't have to call it in every function.
        /// </summary>
        /// <param name="customer">Customer object to add to the queue</param>
        public static void AddCustomer(Customer customer)
        {
            JobQueue.Add(customer);
            UpdateWaits(JobQueue);
            BEWT = FindBEWT();
        }
        /// <summary>
        /// Encapsulates jobQueue, so calling functions will not lose functionality if we need to replace it.
        /// Also consolidates boilerplate, so calling functions do not need to change as we add more nonsense.
        /// </summary>
        /// <returns>The next customer to be served</returns>
        public static Customer RemoveCustomer()
        {
            var foo = JobQueue.PopFront();
            MachineBalance -= foo.Balance;
            UpdateWaits(JobQueue);
            BEWT = FindBEWT();
            return foo;
        }
        /// <summary>
        /// Updates the wait times for each item in the list.
        /// Should be called whenever the queue is updated, either
        /// adding or removing an item.
        /// TODO If we upgrade scheduling to handle multiple jobs in parallel, this MUST be fixed along with it.
        /// </summary>
        public static void UpdateWaits(IPriorityQueue<Customer> PQueue)
        {
            TimeSpan cmltivWait = TimeSpan.Zero;
            foreach (Customer customer in PQueue)
            {
                customer.WaitTime = cmltivWait;
                cmltivWait += customer.JobLength;
            }
        }
        /// <summary>
        /// Calculates the Break-Even Waiting time, an "average" waiting time
        /// for people in the queue. Used in calculating payments; people who wait
        /// less than BEWT pay for their time savings, while people who wait longer
        /// get paid for their patience. 
        /// TODO: Really should make this take JobQueue as a parameter, rather than reaching out for it as a global.
        /// </summary>
        /// <returns></returns>
        public static TimeSpan FindBEWT()
        {
            //Degenerate case; if the queue's empty, wait time is zero.
            if (0 == JobQueue.Count)
                return TimeSpan.Zero;

            /* MachineBalance = sum (customer.TimeValue * (Customer.WaitTime - BEWT))
             * Given that we know everything except BEWT in this equation, it's simple algebra to calculate BEWT.
             * BEWT = (sum(customer.TimeValue * customer.WaitTime) - MachineBalance) / sum(customer.TimeValue)
             */
            double sumPi = 0.0, sumPiTi = 0.0;
            foreach (Customer foo in JobQueue)
            {
                sumPi += foo.TimeValue;
                sumPiTi += (foo.TimeValue * foo.WaitTime.TotalHours);
            }
            double localBEWT = (sumPiTi + MachineBalance) / sumPi;

            Console.WriteLine("Break Even Wait Time is : {0} hours", localBEWT);

            return TimeSpan.FromHours(localBEWT).Trim(TimeSpan.TicksPerSecond);
        }
    }
    public class Job
    {
        protected bool Equals(Job other)
        {
            return Length == other.Length && string.Equals(Name, other.Name);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hashCode = Length.GetHashCode();
                hashCode = (hashCode * 397) ^ (Name != null ? Name.GetHashCode() : 0);
                return hashCode;
            }
        }

        public string Name { get; private set; }
        public TimeSpan Length { get; private set; }
        public int Identifier { get { return GetHashCode(); } }
        public Job(TimeSpan duration, String name)
        {
            Length = duration;
            Name = name;
        }
        public override string ToString()
        {
            string output = String.Format("Name: {1}\tTime needed: {0}",
                Length, Name);
            return output;
        }
        public override bool Equals(object job2)
        {
            if ((job2 == null) || !(job2 is Job)) return false;
            return this == job2;
        }

    }
    public class Customer : IComparable<Customer>
    {
        protected bool Equals(Customer other)
        {
            return timeEnqueued.Equals(other.timeEnqueued) && desiredJob.Equals(other.desiredJob) && string.Equals(Name, other.Name);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = timeEnqueued.GetHashCode();
                hashCode = (hashCode * 397) ^ desiredJob.GetHashCode();
                hashCode = (hashCode * 397) ^ Name.GetHashCode();
                return hashCode;
            }
        }
        /// <summary>
        /// TODO: Really ought to make this less ugly and return more useful data. OTOH, that's what the GUI is for.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return String.Format("Name: {2}\tTime needed: {0:N2}\nTime spent waiting: {1:N2}\tPrice of Time Waited: {3:C2}",
                 JobLength.TotalHours, WaitTime.TotalHours, Name, (TimeValue * WaitTime.TotalHours));
        }
        /// <summary>
        /// Name of customer. Will probably want to add other
        /// identifying/contact info in future development.
        /// </summary>
        public string Name { get; private set; }
        /// <summary>
        /// Value the customer places on their time,
        /// expressed as an hourly rate. 
        /// </summary>
        public double TimeValue { get; private set; }
        /// <summary>
        /// When the customer joined the queue and began
        /// waiting for service. 
        /// </summary>
        private readonly DateTime timeEnqueued;
        /// <summary>
        /// When the customer can expect to be served, 
        /// provisionally, barring significant rearrangement
        /// of the queue.
        /// </summary>
        public DateTime timeOfExpectedService;
        /// <summary>
        /// A *small* deposit paid in when the customer joins the queue, to be
        /// refunded when the customer is finally served (plus/minus any payments
        /// for their time). Primes the pump for payments, and ensures everybody
        /// has some skin in the game.
        /// </summary>
        private readonly double deposit;
        /// <summary>
        /// The job the customer wants done. Should be selected from a
        /// controlled list of options.
        /// TODO: Do we need this public field, or the two properties based on it?
        /// </summary>
        private readonly Job desiredJob;
        /// <summary>
        /// Time spent waiting for service. As much as I hate cleverness, 
        /// we're going to get a little cunning here. Get is the total duration;
        /// timeOfExpectedService - timeEnqueued. Set is the time in the future,
        /// how much longer to wait; timeOfExpectedService - DateTime.Now
        /// Basically it's English; WaitTime as a question or as a statement.
        /// </summary>
        public TimeSpan WaitTime
        {
            get { return (timeOfExpectedService - timeEnqueued).Trim(TimeSpan.TicksPerSecond); }
            set { timeOfExpectedService = DateTime.Now + value; }
        }
        /// <summary>
        /// Public property encapsulating the desiredJob field.
        /// </summary>
        public TimeSpan JobLength { get { return desiredJob.Length; } }
        /// <summary>
        /// Public property encapsulating the desiredJob field.
        /// </summary>
        public string JobName { get { return desiredJob.Name; } }
        /// <summary>
        /// Annoying as all hell, since we need to break encapsulation to access BEWT. 
        /// On the other hand, this must be public so we can display it on the GUI.
        /// </summary>
        public double Balance
        {
            get
            {
                return TimeValue * (WaitTime - Program.BEWT).TotalHours - deposit;
            }
        }
        public Customer(string name, double timeValue, Job desiredJob)
        {
            Name = name;
            TimeValue = timeValue;
            timeEnqueued = DateTime.Now;
            deposit = 0.00;
            this.desiredJob = desiredJob;
        }

        public int CompareTo(Customer other)
        {
            if (Equals(other)) return 0;
            var comp1 = JobLength.TotalHours / TimeValue;
            var comp2 = other.JobLength.TotalHours / other.TimeValue;
            return (comp1 < comp2) ? -1 : 1;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((Customer)obj);
        }
        //Aggravating. I want this to be a property that I can pass to the front-end,
        //And I also want it to explicitly take BEWT as a parameter.
        public double FindBalance(TimeSpan BEWT)
        {
            return TimeValue * (WaitTime - BEWT).TotalHours;
        }
    }
}
