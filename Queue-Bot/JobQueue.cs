using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Threading;

namespace Queue_Bot
{
    public class JobQueue
    {
        /// <summary>
        /// Singleton; used to create a static instance for everybody consuming this class and also for the Task objects.
        /// </summary>
        public static Queue_Bot.JobQueue QueueInstance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new Queue_Bot.JobQueue();
                            instance.Initialize();
                        }
                    }
                }

                return instance;
            }
        }
        private static volatile JobQueue instance;
        private static object syncRoot = new Object();

        /// <summary>
        /// The heart of this project. Not sure if I really need the PQueue wrapper, or
        /// if I can just get away with using a SortedSet directly, since the behavior
        /// shouldn't matter to anything using this library, and I'm going to change away
        /// from even an IPQueue before I change how the scheduling works. Fuck it, I'll do it right for now.
        /// </summary>
        private readonly IPriorityQueue<Task> internalQueue = new PriorityQueue<Task>();

        /// <summary>
        /// How much money is on the machine, used for bookkeeping purposes and working out how much the system owes
        /// or is owed by the customers. By default only changes because of customers making and taking payments, but it'd
        /// be easy enough to add some code saying "Balance drops $.07/hr to pay for the cost of operation".
        /// </summary>
        /// <remarks>
        /// TODO: Find some way to persist this and/or record changes in balance. I want to be able to shut everything down and rebuild the entire state from 0.
        /// </remarks>
        public double MachineBalance { get; private set; }

        /// <summary>
        /// Calculates the Break-Even Waiting time, an "average" waiting time
        /// for people in the queue. Used in calculating payments; people who wait
        /// less than BEWT pay for their time savings, while people who wait longer
        /// get paid for their patience. 
        /// </summary>
        /// <returns>TimeSpan representing the break-even time.</returns>
        public TimeSpan BEWT
        {
            get
            {
                //Degenerate case; if the queue's empty, wait time is zero.
                if (0 == internalQueue.Count)
                    return TimeSpan.Zero;

                /* MachineBalance = sum (customer.TimeValue * (Customer.WaitTime - BEWT))
                 * Given that we know everything except BEWT in this equation, it's simple algebra to calculate BEWT.
                 * BEWT = (sum(customer.TimeValue * customer.WaitTime) - MachineBalance) / sum(customer.TimeValue)
                 */
                double sumPi = 0.0, sumPiTi = 0.0;
                foreach (Task foo in internalQueue)
                {
                    sumPi += foo.timePrice;
                    sumPiTi += (foo.timePrice * foo.WaitTime.TotalHours);
                }
                double localBEWT = (sumPiTi + MachineBalance) / sumPi;

                //Console.WriteLine("Break Even Wait Time is : {0} hours", localBEWT);

                return TimeSpan.FromHours(localBEWT);
            }
        }
        public IEnumerable<Job> jobList
        {
            get
            {
                using (var dbAccess = new JobContext())
                {
                    return dbAccess.Jobs.ToList();
                }
            }
        }

        public IEnumerable<Task> taskList
        {
            get
            {
                return internalQueue.ToList();
            }
        }
        public IEnumerable<Customer> customerList
        {
            get
            {
                using (var dbAccess = new JobContext())
                {
                    return dbAccess.Customers.ToList();
                }
            }
        }

        public static void Main()
        {
            Console.Write("MainMethod");
        }
        private void Initialize()
        {
            MachineBalance = 0;
            using (var dbAccess = new JobContext())
            {
                if (dbAccess.Jobs.Any())
                {//Just refresh the queue and return.
                    QueueInstance.internalQueue.Clear();
                    foreach (var item in dbAccess.Tasks.Where(task => task.taskStatus.Equals("Waiting")))
                    {
                        QueueInstance.internalQueue.Add(new Task
                        {
                            deposit = item.deposit,
                            AuthID = item.AuthID,
                            customer = item.customer,
                            job = item.job,
                            jobId = item.jobId,
                            taskStatus = item.taskStatus,
                            timeEnqueued = item.timeEnqueued,
                            timePrice = item.timePrice,
                            TaskId = item.TaskId
                        });
                    }

                    UpdateWaits(QueueInstance.internalQueue);
                    return;
                }
                Job[] jobList = {new Job(new TimeSpan(2, 0, 0) , "Rotate tires"),
                    new Job(TimeSpan.FromHours(.5), "Hoover the roof") ,
                    new Job(new TimeSpan(1, 40, 0),  "Square the circle"),
                    new Job(new TimeSpan(2, 30,0),  "Empty liquor cabinet"),
                    new Job(new TimeSpan(3, 0,0), "Destroy watermelons")
                };
                dbAccess.Jobs.AddRange(jobList);

                //Initialization.
                dbAccess.SaveChanges();
                QueueInstance.internalQueue.Clear();
                var bob = new Customer { Name = "Bob", AuthId = "asdkfljakdf" };
                AddCustomer(bob, dbAccess.Jobs.Find(2), 1.2);
                AddCustomer(new Customer { Name = "Gerald", AuthId = "u890asdf" }, dbAccess.Jobs.Find(1), 4.1);
                var changedTask = internalQueue.First(item => item.customer.Name == "Gerald");
                var newTask = new Task
                {
                    deposit = changedTask.deposit,
                    AuthID = changedTask.AuthID,
                    customer = changedTask.customer,
                    job = changedTask.job,
                    jobId = changedTask.jobId,
                    timeEnqueued = changedTask.timeEnqueued,
                    timePrice = 4,
                    TaskId = changedTask.TaskId
                };
                updateTask(newTask, changedTask.TaskId);
            }
        }

        public void updateTask(Task newTask, Guid oldTaskId)
        {
            using (var dbAccess = new JobContext())
            {
                var original = dbAccess.Tasks.Find(oldTaskId);

                if (original != null)
                {
                    var foo = internalQueue.First(item => item.TaskId == oldTaskId);
                    foo.timePrice = newTask.timePrice;
                    foo.jobId = newTask.jobId;
                    foo.job = newTask.job;
                    foo.deposit = newTask.deposit;
                    UpdateWaits(internalQueue);

                    dbAccess.Entry(original).CurrentValues.SetValues(newTask);
                    dbAccess.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Encapsulates jobQueue, so external programs don't have to interface with it directly, and can replace it as needed.
        /// Also consolidates the boilerplate involved in object addition, so we don't have to call it in every function.
        /// TODO: Probably ought to move half of this into the actual PQueue class, for the same reason above, particularly UpdateWaits.
        /// </summary>
        /// <param name="customer">Customer object to add to the queue</param>
        /// <param name="job">Job that customer wants done</param>
        /// <param name="timeValue">Customer's timevalue</param>
        public Task AddCustomer(Customer customer, Job job, double timeValue)
        {
            using (var dbAccess = new JobContext())
            {
                if (!dbAccess.Customers.Any(registeredCustomers => customer.AuthId == registeredCustomers.AuthId))
                {
                    dbAccess.Customers.Add(customer);
                }
                var foo = dbAccess.Tasks.Add(new Task()
                {
                    TaskId = Guid.NewGuid(),
                    customer = dbAccess.Customers.Find(customer.AuthId),
                    job = dbAccess.Jobs.Find(job.JobId),
                    timeEnqueued = DateTime.Now,
                    taskStatus = "Waiting",
                    timePrice = timeValue,
                    timeOfExpectedService = DateTime.Now.AddHours(1)
                });
                internalQueue.Add(foo);
                UpdateWaits(internalQueue);
                dbAccess.SaveChanges();
                return foo;
            }
        }
        /// <summary>
        /// Encapsulates jobQueue, so calling functions will not lose functionality if we need to replace it.
        /// Also consolidates boilerplate, so calling functions do not need to change as we add more nonsense.
        /// </summary>
        /// <returns>The next customer to be served</returns>
        public Task RemoveCustomer()
        {
            using (var dbAccess = new JobContext())
            {
                var foo = internalQueue.PopFront();
                foo.taskStatus = "Complete";
                MachineBalance -= foo.Balance;
                UpdateWaits(internalQueue);
                var bar = dbAccess.Tasks.First(item => item.TaskId == foo.TaskId);
                bar.taskStatus = "Complete";
                dbAccess.SaveChanges();

                return foo;
            }
        }
        /// <summary>
        /// Updates the wait times for each item in the list.
        /// Should be called whenever the queue is updated, either
        /// adding or removing an item.
        /// TODO If we upgrade scheduling to handle multiple jobs in parallel, this MUST be fixed along with it.
        /// TODO: Also need to set wait times according to when the next server is available. Doesn't help much to say customer 3 gets served 20m after customer 2, if customer 2 won't be served for 2 hours.
        /// </summary>
        private void UpdateWaits(IPriorityQueue<Task> PQueue)
        {
            TimeSpan cmltivWait = TimeSpan.Zero;
            foreach (Task customer in PQueue)
            {
                customer.WaitTime = cmltivWait;
                cmltivWait += customer.job.Length;
            }
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
        public string Name { get; set; }
        public TimeSpan Length { get; set; }
        //TODO: Do we really still need a hash when we've got a proper key?
        public int Hash { get { return GetHashCode(); } }
        public int JobId { get; set; }
        public Job() : this(TimeSpan.FromMinutes(30), "Get Plastered") { }
        public Job(TimeSpan duration, String name)
        {
            Length = duration;
            Name = name;
        }
    }
    public class JobContext : DbContext
    {
        public JobContext() : base("Queue_Bot.Properties.Settings.JobStoreConnectionString")
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<JobContext>());
        }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Task> Tasks { get; set; }
    }
    public class Customer
    {
        /// <summary>
        /// ID used for connection with whichever authentication system we use. 
        /// </summary>
        [Key]
        public string AuthId { get; set; }
        /// <summary>
        /// Name of customer. Will probably want to add other identifying/contact info in future development.
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// This is supposed to be a list of jobs requested by each customer. Unfortunately it's giving me "circular reference" issues,
        /// since each of these jobs also refers to the customer that requested them. 
        /// Fuck it. I'll just have the app attach jobs to customers client-side.
        /// </summary>
        //public virtual ICollection<Task> requestedJobs { get; set; }
    }

    /// <summary>
    /// The actual undertaking that will get passed to operators; combination of Customer, DesiredJob, and scheduling info. 
    /// TODO: Better fucking names, for this and the available-services class. Can't use Service, Task, Request, Operation, or Assignment lest they be confused with other terms in CS. Maybe Chores?
    /// </summary>
    public class Task : IComparable<Task>
    {
        public int CompareTo(Task other)
        {
            if (Equals(other)) return 0;
            if (other.TaskId.Equals(TaskId)) return 0;
            var comp1 = job.Length.TotalHours / (double)timePrice;
            var comp2 = other.job.Length.TotalHours / (double)other.timePrice;
            if (comp1 < comp2)
                return -1;
            else if (comp2 < comp1)
                return 1;
            else
                return (timeEnqueued.CompareTo(other.timeEnqueued));
        }

        /// <summary>
        /// TODO: Really ought to make this less ugly and return more useful data. OTOH, that's what the GUI is for.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return String.Format("Name: {2}\tTime needed: {0:N2}\nTime spent waiting: {1:N2}\tPrice of Time Waited: {3:C2}",
                 job.Length.TotalHours, WaitTime.TotalHours, customer.Name, (timePrice * WaitTime.TotalHours));
        }
        [Key]
        public Guid TaskId { get; set; }
        /// <summary>
        /// TODO: Which of these fields do we really need? 
        /// </summary>
        public string AuthID { get; set; }
        [ForeignKey("AuthID")]
        public virtual Customer customer { get; set; }
        /// <summary>
        /// What the customer needs, chosen from a controlled list of options.
        /// </summary>
        public int jobId { get; set; }
        [ForeignKey("jobId")]
        public virtual Job job { get; set; }
        /// <summary>
        /// Status of the task; "Waiting for service", "Completed", "Cancelled", ETC. 
        /// TODO: Turn this into a proper enum, probably referencing another database. That'll probably wait until I convert this to use SProcs instead of ORM, though.
        /// </summary>
        public String taskStatus { get; set; }
        /// <summary>
        /// Value the customer places on their time, expressed as an hourly rate. Based either on income and lost earnings,
        /// or "I will pay $20 to get out of here an hour sooner".
        /// </summary>
        /// <remarks>No, this isn't the right type, but for small amounts like this, it'll do and saves time casting everything.</remarks>
        public double timePrice { get; set; }
        /// <summary>
        /// When the customer selected their desired job and joined the queue.
        /// </summary>
        public DateTime timeEnqueued { get; set; }
        /// <summary>
        /// When the customer can expect to be served, provisionally, barring significant rearrangement of the queue.
        /// Not stored in the DB,entirely handled in-program.
        /// </summary>
        /// <remarks>Honestly I tried to map this to the DB, but a) It's all calculated here in any case, and
        /// b) it was giving me lip and causing concurrency errors.</remarks>
        public DateTime timeOfExpectedService { get; set; }
        /// <summary>
        /// Time spent waiting for service. As much as I hate clever code, we're going to get a little cunning here.
        /// Get is the total duration; timeOfExpectedService - timeEnqueued.
        /// Set is the time in the future, how much longer to wait; timeOfExpectedService - DateTime.Now
        /// Basically it's English; asking vs stating WaitTime.
        /// </summary>
        [NotMapped]
        public TimeSpan WaitTime
        {
            get { return (timeOfExpectedService - timeEnqueued); }
            set { timeOfExpectedService = DateTime.Now + value; }
        }
        /// <summary>
        /// A *small* deposit paid in when the customer joins the queue, to be
        /// refunded when the customer is finally served (plus/minus any payments
        /// for their time). Primes the pump for payments, and ensures everybody
        /// has some skin in the game.
        /// </summary>
        public double deposit { get; set; }

        /// <summary>
        /// Annoying as all hell, since we need to break encapsulation to access BEWT. 
        /// On the other hand, this must be public so we can display it on the GUI.
        /// </summary>
        public double Balance { get { return timePrice * (WaitTime - JobQueue.QueueInstance.BEWT).TotalHours - deposit; } }
    }
}
