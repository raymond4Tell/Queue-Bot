using System;

/* Workflow runs in two (async?) loops. Probably just functions
 * on a service; users can add/modify jobs, service automatically pops jobs.
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
 * Break-Even Wait Time calculation: Balance = sum (timeValue * (timeWaiting - BEWT))
 * BEWT is the "average" wait time, so that
 * (payments from people who wait less than BEWT) + (payments to people who wait longer than BEWT) = Balance on computer.
 * Balance is initially 0, but will change as people leave the queue and pay/get paid for their wait.
 * May also change over time due to the cost of operating this service; bandwidth costs, electricity, ETC.
 */
namespace Queue_Bot
{
    class Program
    {
        private static BinaryPriorityQueue jobQueue = new BinaryPriorityQueue();
        private static double balance = 0.0;
        public static double BEWT;
        static void Main()
        {
            jobQueue.Push(new Job(2, 2.5, "Rotate tires"));
            jobQueue.Push(new Job(4, .5, "Hoover the roof"));
            jobQueue.Push(new Job(1, 3.5, "Square the circle"));
            jobQueue.Push(new Job(1, 4, "Dispose of vodka"));
            Job foo = new Job(3, 1.4, "Destroy the GOP");
            jobQueue.Push(foo);
            jobQueue.updateWaits();
            BEWT = findBEWT();
            foreach (Job thisJob in jobQueue)
            {
                Console.WriteLine(thisJob.ToString());
                double tempBalance = thisJob.findBalance(BEWT);
                Console.WriteLine(tempBalance > 0 ? "Customer is owed: {0:C2}" : "Customer owes: {0:C2}", tempBalance);
                Console.WriteLine("--------------------------");
            }
            Console.Read();
        }

        private static double findBEWT()
        {
            /* Balance = sum (Pi * (Ti - BEWT)) = sum(Pi * Ti - Pi * BEWT)
             * Balance = sum(Pi * Ti) - sum(Pi * BEWT) = sum(Pi * Ti) - (sum(Pi) * BEWT)
             * sum(Pi) * BEWT = sum(Pi * Ti) - balance
             */
            double sumPi = 0.0, sumPiTi = 0.0;
            foreach (Job thisJob in jobQueue)
            {
                sumPi += thisJob.Price;
                sumPiTi += (thisJob.Price * thisJob.timeWaited);
            }
            double localBEWT = (sumPiTi - balance) / sumPi;
            Console.WriteLine("Break Even Wait Time is : {0}", localBEWT);
            return localBEWT;
        }
    }

    class Job : IComparable
    {
        protected bool Equals(Job other)
        {
            return timeNeeded == other.timeNeeded && timePrice.Equals(other.timePrice) && string.Equals(name, other.name);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hashCode = timeNeeded;
                hashCode = (hashCode * 397) ^ timePrice.GetHashCode();
                hashCode = (hashCode * 397) ^ (name != null ? name.GetHashCode() : 0);
                return hashCode;
            }
        }

        private readonly int timeNeeded;
        private readonly double timePrice;
        private readonly String name;
        public int timeWaited;
        public int Length { get { return timeNeeded; } }
        public double Price { get { return timePrice; } }
        public Job(int hoursNeeded, double timePrice, String name)
        {
            this.timeNeeded = hoursNeeded;
            this.timePrice = timePrice;
            this.name = name;
            timeWaited = 0;
        }
        public override string ToString()
        {
            string output = String.Format("Name: {2}\tTime needed: {0}\nTime spent waiting: {1}\tPrice of Time Waited: {3}",
                timeNeeded, timeWaited, name, timePrice * timeWaited);
            return output;
        }
        public override bool Equals(object job2)
        {
            if ((job2 == null) || !(job2 is Job)) return false;
            return this == job2;
        }

        public int CompareTo(object obj)
        {
            if (!(obj is Job)) return 1;
            Job job1 = (Job)obj;
            if (job1.Equals(this))
                return 0;
            double comp1 = this.Length / this.Price;
            double comp2 = job1.Length / job1.Price;
            return (comp1 < comp2) ? -1 : 1;
        }

        public double findBalance(double BEWT)
        {
            return timePrice * (timeWaited - BEWT);
        }
    }
}
