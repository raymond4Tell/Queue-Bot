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
namespace Queue_Bot
{
    public class QueueRepo : IQueueRepository
    {
        private string connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Queue_Bot.Properties.Settings.JobStoreConnectionString;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

        public Customer addCustomer(Customer newCustomer)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                db.Execute("insert into Customers(Name, AuthId) values (@Name, @AuthId)", newCustomer);
                return db.Query<Customer>("Select * From Customers where AuthId = @AuthId", newCustomer).FirstOrDefault();
            }
        }

        public Task addTask(Task newTask)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                var foo = db.ExecuteScalar<Guid>("insert into Tasks(taskID, authId, jobid, taskStatus, customernotes, adminnotes, timeprice,timeenqueued, timeOfExpectedService, deposit, Balance)" +
                                    " output inserted.taskId" +
                                     " values (newid(), @authid, @jobid, @taskstatus, @customernotes, @adminnotes, @timeprice, getdate(), dateadd(hour, 1, getdate()), @deposit, @Balance)", newTask);
                return getTaskById(foo);
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
                        + " where AuthId = @AuthId", (task, job) => { task.job = job; return task; }, item, splitOn: "jobId").ToList();
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
                return db.Query<Task, Customer, Job, Task>("Select * From Tasks"
                       + " inner join Jobs on Jobs.JobId = Tasks.jobId"
                    + " inner join Customers on Customers.AuthId = Tasks.AuthID"
                    + " where taskId = @taskId", (task, user, job) => { task.customer = user; task.job = job; return task; }, splitOn: "authId,jobId", param: new { taskId = taskId }).FirstOrDefault();
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
                //(taskID, authId, jobid, taskStatus, customernotes, adminnotes, timeprice, timeenqueued, timeOfExpectedService, deposit, Balance)
                string sqlQuery = "UPDATE Tasks SET jobid = @jobid, taskStatus = @taskStatus, customernotes = @customernotes, adminnotes = @adminnotes, Balance = @balance, timeOfExpectedService = @timeOfExpectedService, timeprice = @timeprice WHERE taskId = @taskId";
                int rowsAffected = db.Execute(sqlQuery, changedTask);

                return getTaskById(changedTask.TaskId);
            }
        }
    }
}
