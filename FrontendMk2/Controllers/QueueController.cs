using Queue_Bot;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FrontendMk2.Controllers
{
    [RoutePrefix("api/Queue")]
    public class QueueController : ApiController
    {
        public struct QueueDTO
        {
            public double MachineBalance;
            public TimeSpan BEWT;
            public IEnumerable<Task> internalQueue;
        }
        [HttpGet, Route("Queue")]
        public QueueDTO GetQueueStatus()
        {
            var foo = new QueueDTO
            {
                MachineBalance = JobQueue.QueueInstance.MachineBalance,
                BEWT = JobQueue.QueueInstance.BEWT,
                internalQueue = JobQueue.QueueInstance.taskList
            };
            return foo;
        }
        [HttpGet, Route("Tasks")]
        public IEnumerable<Task> GetTasks()
        {
            var foo = JobQueue.QueueInstance.taskList;
            return foo.ToList();
        }
        [HttpGet, Route("Jobs")]
        public IEnumerable<Job> GetJobs()
        {
            var foo = JobQueue.QueueInstance.jobList;
            return foo.ToList();
        }
        [HttpGet, Route("Tasks/{id:guid}")]
        public Task GetSingleTask(Guid id)
        {
            return JobQueue.QueueInstance.taskList.FirstOrDefault(item => item.TaskId == id);
        }

        [HttpPost, Route("Tasks")]
        public Task CreateNewTask([FromBody]Task value)
        {
            //TODO: Get customer data from authentication, that's what it's for.
            var foo = JobQueue.QueueInstance.jobList.First(item => item.JobId == value.jobId);
            return JobQueue.QueueInstance.AddCustomer(value.customer, foo, value.timePrice);
        }

        [HttpPut, Route("Tasks/{id:guid}")]
        public void UpdateTask(Guid id, [FromBody]Task value)
        {
            JobQueue.QueueInstance.updateTask(value, id);
        }

        [HttpDelete, Route("Tasks/{id:guid}")]
        public void Delete(Guid id)
        {
        }
    }
}
