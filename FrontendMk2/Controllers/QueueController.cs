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
        [HttpGet, Route("Tasks")]
        public IEnumerable<Task> GetTasks()
        {
            var foo = JobQueue.QueueInstance.getTaskList();
            return foo.ToList();
        }
        [HttpGet, Route("Jobs")]
        public IEnumerable<Job> GetJobs()
        {
            var foo = JobQueue.QueueInstance.getJobList();
            return foo.ToList();
        }
        [HttpGet, Route("Tasks/{id:guid}")]
        public Task GetSingleTask(Guid id)
        {
            return JobQueue.QueueInstance.getTaskList().FirstOrDefault(item => item.TaskId == id);
        }

        [HttpPost, Route("Tasks")]
        public IEnumerable<Task> CreateNewTask([FromBody]Task value)
        {
            //TODO: Get customer data from authentication, that's what it's for.
            var foo = JobQueue.QueueInstance.getJobList().First(item => item.JobId == value.jobId);
            JobQueue.QueueInstance.AddCustomer(value.customer, foo, value.timePrice);
            return JobQueue.QueueInstance.getTaskList();
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
