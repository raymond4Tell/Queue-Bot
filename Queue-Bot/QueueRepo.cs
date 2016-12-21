using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Queue_Bot
{
    class QueueRepo : IQueueRepository
    {
        public Task addTask(Task newTask)
        {
            using (var dbAccess = new JobContext())
            {
                if (!dbAccess.Customers.Any(registeredCustomers => newTask.customer.AuthId == registeredCustomers.AuthId))
                {
                    dbAccess.Customers.Add(newTask.customer);
                }
                var foo = dbAccess.Tasks.Add(newTask);
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
                return            dbAccess.Tasks.First(item => item.TaskId == taskId);

            }
        }

        public IEnumerable<Task> getTasksAll()
        {
            using (var dbAccess = new JobContext())
            {
                return dbAccess.Tasks.ToList();
            }
        }

        public IEnumerable<Task> getTasksForQueue()
        {
            throw new NotImplementedException();
        }

        public Task updateTask(Task changedTask)
        {
            using (var dbAccess = new JobContext())
            {
                dbAccess.Entry(changedTask).CurrentValues.SetValues(changedTask);
                return dbAccess.Entry(changedTask).Entity;
            }
        }
    }
}
