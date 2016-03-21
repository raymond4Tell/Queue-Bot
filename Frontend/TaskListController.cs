using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Queue_Bot;
namespace App.Frontend
{
    /// <summary>
    /// Just used so the POST endpoint has a structure to accept.
    /// </summary>
    public class CustomerDTO
    {
        public string name;
        public double timeValue;
        public int desiredJob;
    }

    //Tempted to just return the one Program object, for some guarantee that everything is current. Also,
    [System.Web.Http.Authorize]
    public class TaskListController : ApiController
    {
        Lazy<IHubContext> hub = new Lazy<IHubContext>(
        () => GlobalHost.ConnectionManager.GetHubContext<JobHub>()
            );
        protected IHubContext Hub
        {
            get { return hub.Value; }
        }

        // GET api/<controller>
        public IEnumerable<Customer> GetCustomers()
        {
            //Program.Main();
            //Hub.Clients.All.Hello();
            return JobQueue.internalQueue;
        }

        public IEnumerable<Job> GetServices()
        {
            return JobQueue.jobList;
        }

        public TimeSpan GetBEWT()
        {
            return JobQueue.BEWT;
        }

        public double GetBalance()
        {
            return JobQueue.MachineBalance;
        }

        //Dammit. Can't return actual Customer, since that has too many fields to initialize
        //client-side, and can't just take object, since that can have any fields it likes.
        //Created CustomerDTO class just so we can have some actual structure.
        [HttpPost]
        public IEnumerable<Customer> NewCustomer(CustomerDTO value)
        {
            var bar = JobQueue.jobList.First(item => item.Identifier == value.desiredJob);
            var foo = new Customer(value.name, value.timeValue, bar);
            JobQueue.AddCustomer(foo);

            Hub.Clients.All.refreshJobs(JobQueue.internalQueue);
            return JobQueue.internalQueue;
        }

        //No ID param because we just want to pop the first item
        [HttpGet]
        public Customer RemoveCustomer()
        {
            var nextServed = JobQueue.RemoveCustomer();
            Hub.Clients.All.refreshJobs(JobQueue.internalQueue);
            return nextServed;
        }
    }
}