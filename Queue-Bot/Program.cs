using System;

/* Plan:
 * 1: PQueue to hold the jobs. Check
 * 1a: Jobs class; Time needed, cost of time, name of job. Check.
 * 1b: Sorting- find min(sum(Ti * Pi)). Can possibly be done using backtracking and hamiltonian cycle. 
 * 2: Find BEWT; sum(Pi * Ti - BEWT) = balance
 * 3: Work out how much everybody owes.
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
                if (tempBalance > 0)
                    Console.WriteLine("Customer is owed: {0:C2}", tempBalance);
                else
                    Console.WriteLine("Customer owes: {0:C2}", tempBalance);
                Console.WriteLine("--------------------------");
            }
            Console.Read();
        }

        private static double findBEWT()
        {
            /* Balance = sum (Pi * (Ti - BEWT)) = sum(Pi * Ti - Pi * BEWT)
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
            if ((obj == null) || !(obj is Job)) return 1;
            Job job1 = (Job)obj;
            if (job1.Equals(this))
                return 0;
            double comp1 = this.timeNeeded / this.timePrice;
            double comp2 = job1.Length / job1.Price;
            return (comp1 < comp2) ? -1 : 1;
        }

        public double findBalance(double BEWT)
        {
            return timePrice * (timeWaited - BEWT);
        }
    }
}
