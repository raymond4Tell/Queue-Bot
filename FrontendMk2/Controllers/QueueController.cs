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
        private JobQueue queueService = new JobQueue(new QueueRepo());
        [HttpGet, Route("Queue")]
        public QueueDTO GetQueueStatus()
        {
            var foo = queueService.queueStatus;
            return foo;
        }
        [HttpGet, Route("Tasks")]
        public IEnumerable<Task> GetTasks()
        {
            var foo = queueService.taskListFull;
            return foo;
        }
        [HttpGet, Route("Jobs")]
        public IEnumerable<Job> GetJobs()
        {
            var foo = queueService.jobList;
            return foo;
        }
        [HttpGet, Route("Customers")]
        public IEnumerable<Customer> GetCustomers()
        {
            var foo = queueService.customerList;
            return foo;
        }
        [HttpGet, Route("Tasks/{id:guid}")]
        public Task GetSingleTask(Guid id)
        {
            return queueService.taskListFull.FirstOrDefault(item => item.TaskId == id);
        }

        [HttpGet, Route("Tasks/Next")]
        public Task GetNextTask()
        {
            return queueService.RemoveCustomer();
        }

        [HttpPost, Route("Tasks")]
        public Task CreateNewTask([FromBody]Task value)
        {
            //TODO: Get customer data from authentication, that's what it's for.
            var foo = queueService.jobList.First(item => item.JobId == value.jobId);
            return queueService.AddCustomer(value.customer, foo, value.timePrice);
        }

        [HttpPut, Route("Tasks/{id:guid}")]
        public void UpdateTask(Guid id, [FromBody]Task value)
        {
            queueService.updateTask(value, id);
        }

        [HttpDelete, Route("Tasks/{id:guid}")]
        public void Delete(Guid id)
        {
        }
    }
}
