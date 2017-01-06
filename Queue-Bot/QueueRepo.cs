using System;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Dapper;
using System.Data.SqlClient;
using System.Configuration;
using Dapper.Contrib.Extensions;

namespace Queue_Bot
{
    public class QueueRepo : IQueueRepository
    {
        private string connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Queue_Bot.Properties.Settings.JobStoreConnectionString;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
        public Customer addCustomer(Customer newCustomer)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                db.Insert(newCustomer);
                return db.Query<Customer>("Select * From Customers where AuthId = @AuthId", newCustomer.AuthId).FirstOrDefault();
            }
        }

        public Task addTask(Task newTask)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                db.Execute("insert into Tasks(taskID, authId, jobid, taskStatus, customernotes, adminnotes, timeprice,timeenqueued, timeOfExpectedService, deposit, Balance) values" +
                    "(newid(), @authid, @jobid, @taskstatus, @customernotes, @adminnotes, @timeprice, @timeenqueued, @timeOfExpectedService, @deposit, @Balance)", newTask);
                return db.Query<Task>("Select * From task where AuthId = @AuthId", newTask.timeEnqueued).FirstOrDefault();

            }
        }

        public IEnumerable<Customer> getCustomers()
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                var foo = db.Query<Customer>("Select * From Customers").ToList();
                foreach (var item in foo)
                {
                    var bar = db.Query<Task, Job, Task>("Select * From Tasks"
                        + " inner join Jobs on Jobs.JobId = Tasks.jobId"
                        + " where AuthId = @AuthId",  (task, job) => { task.job = job; return task; }, item, splitOn: "jobId").ToList();
                    item.requestedJobs = bar;
                }
                return foo;
            }
        }


        public IEnumerable<Job> getJobs()
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                return db.Query<Job>("Select * From Jobs").ToList();
            }
        }

        public Task getTaskById(Guid taskId)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                return db.Query<Task>("Select * From Tasks where taskId = @taskId", taskId).FirstOrDefault();
            }
        }

        public IEnumerable<Task> getTasksAll()
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                return db.Query<Task, Customer, Job, Task>("Select * From Tasks" +
                    " inner join Customers on Customers.AuthId = Tasks.AuthID" +
                    " inner join Jobs on Jobs.JobId = Tasks.jobId", (task, user, job) => { task.customer = user; task.job = job; return task; }, splitOn: "authId,jobId").ToList();
            }
        }

        public IEnumerable<Task> getTasksForQueue()
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                return db.Query<Task, Customer, Job, Task>("Select * From Tasks"
                    + " inner join Jobs on Jobs.JobId = Tasks.jobId"
                    + " inner join Customers on Customers.AuthId = Tasks.AuthID"
                    + " where taskStatus = 'Waiting' ", (task, user, job) => { task.job = job; task.customer = user; return task; }, splitOn: "jobId,authId").ToList();
            }
        }

        public Task updateTask(Task changedTask)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                string sqlQuery = "UPDATE Task SET FirstName = @FirstName, LastName = @LastName WHERE taskId = @taskId";
                int rowsAffected = db.Execute(sqlQuery, changedTask);

                return db.Query<Task>("Select * From Tasks where taskId = @taskId", changedTask.TaskId).FirstOrDefault();
            }
        }
    }
}
