using Queue_Bot;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FrontendMk2.Controllers
{
    public class QueueController : ApiController
    {
        // GET: api/Queue
        public IEnumerable<Task> Get()
        {
            var foo = JobQueue.QueueInstance.getTaskList();
            return foo.ToList();
        }

        // GET: api/Queue/5
        public Task Get(Guid id)
        {
            return JobQueue.QueueInstance.getTaskList().FirstOrDefault(item => item.TaskId == id);
        }

        // POST: api/Queue
        public void Post([FromBody]Task value)
        {
            //QueueBotWrapper.Instance.AddCustomer(value.customer, value.job, value.timePrice);
            var foo = JobQueue.QueueInstance.getJobList().First(item => item.JobId == 1);
            JobQueue.QueueInstance.AddCustomer(new Customer { Name = "Gerald", AuthID = "u890asdf" }, foo, 4.1);

        }

        // PUT: api/Queue/5
        public void Put(Guid id, [FromBody]Task value)
        {
            JobQueue.QueueInstance.updateTask(value, id);
        }

        // DELETE: api/Queue/5
        public void Delete(int id)
        {
        }
    }
}
