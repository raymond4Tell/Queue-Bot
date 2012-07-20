using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BenTools.Data;

/* Plan:
 * 1: PQueue to hold the jobs. 
 * 1a: Jobs class; Time needed, cost of time, name of job.
 * 1b: Sorting- find min(sum(Ti * Pi)). 
 * 2: Find BEWT; sum(Pi * Ti - BEWT) = balance
 * 3: Work out how much everybody owes.
 */
namespace Queue_Bot
{
    class Program
    {
        private static BinaryPriorityQueue jobQueue = new BinaryPriorityQueue();
        static void Main(string[] args)
        {
            jobQueue.Push(new Job(2, 2.5, "Rotate tires"));
            jobQueue.Push(new Job(4, .5, "Hoover the roof"));
            jobQueue.Push(new Job(1, 3.5, "Square the circle"));
            jobQueue.Push(new Job(1, 4, "Dispose of vodka"));
            Job foo = new Job(3, 1.4, "Destroy the GOP");
            jobQueue.Push(foo);
            jobQueue.updateWaits();
            foreach (Job thisJob in jobQueue)
            {
                Console.WriteLine(thisJob.ToString());
            }
            Console.Read();
        }

    }

    class Job : IComparable
    {
        private int timeNeeded;
        private double timePrice;
        private String name;
        public int timeWaited;
        public int Length
        {
            get
            { return timeNeeded; }
        }
        public double Price
        {
            get { return timePrice; }
        }
        public Job(int hoursNeeded, double timePrice, String name)
        {
            this.timeNeeded = hoursNeeded;
            this.timePrice = timePrice;
            this.name = name;
            timeWaited = 0;
        }
        public string ToString()
        {
            string output = String.Format("Name: {2}\tTime needed: {0}\tTime waited: {1}\n---------", timeNeeded, timeWaited, name);
            return output;
        }
        public static bool operator ==(Job job1, Job job2)
        {
            return (job1.timeNeeded == job2.timeNeeded) && (job1.timePrice.Equals(job2.timePrice));
        }

        public static bool operator !=(Job job1, Job job2)
        {
            return (job1.timeNeeded != job2.timeNeeded) || !(job1.timePrice.Equals(job2.timePrice));
        }

        public override bool Equals(object job2)
        {
            if ((job2 == null) || !(job2 is Job)) return false;
            return this == (Job)job2;
        }

        public int CompareTo(object obj)
        {
            if ((obj == null) || !(obj is Job)) return 1;
            Job job1 = (Job)obj;
            if (job1 == this)
                return 0;
            double comp1 = this.timeNeeded / this.timePrice;
            double comp2 = job1.Length / job1.Price;
            return (comp1 > comp2) ? -1 : 1;
        }
    }
}
