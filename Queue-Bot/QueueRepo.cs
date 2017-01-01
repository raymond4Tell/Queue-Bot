using System;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Queue_Bot
{
    public class QueueRepo : IQueueRepository
    {
        public Customer addCustomer(Customer newCustomer)
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Customers.Add(newCustomer);
            }
        }

        public Task addTask(Task newTask)
        {
            using (var dbAccess = new JobContext())
            {
               
                var foo = dbAccess.Tasks.Add(newTask);
                dbAccess.SaveChanges();
                return foo;
            }
        }

        public IEnumerable<Customer> getCustomers()
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Customers.ToList();
            }
        }


        public IEnumerable<Job> getJobs()
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Jobs.ToList();
            }

        }

        public Task getTaskById(Guid taskId)
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Tasks.First(item => item.TaskId == taskId);

            }
        }

        public IEnumerable<Task> getTasksAll()
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Tasks.Include(t => t.customer).Include(t => t.job).ToList();
            }
        }

        public IEnumerable<Task> getTasksForQueue()
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Tasks.Where(task => task.taskStatus.Equals("Waiting")).Include(t => t.customer).Include(t => t.job).ToList();
            }
        }

        public Task updateTask(Task changedTask)
        {
            using (var dbAccess = new JobContext())
            {
                dbAccess.Tasks.Attach(changedTask);
                dbAccess.Entry(changedTask).CurrentValues.SetValues(changedTask);
                return dbAccess.Entry(changedTask).Entity;
            }
        }
    }
}
