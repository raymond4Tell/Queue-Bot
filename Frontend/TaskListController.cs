using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
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
    public class TaskListController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Customer> Get()
        {
            Program.Main();
            return Program.JobQueue;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        //Dammit. Can't return actual Customer, since that has too many fields to initialize
        //client-side, and can't just take object, since that can have any fields it likes.
        //Created CustomerDTO class just so we can have some actual structure.
        // POST api/<controller>
        public IEnumerable<Customer> Post(CustomerDTO value)
        {
            var bar = Program.jobList.First(item => item.Identifier == value.desiredJob);
            var foo = new Customer(value.name, value.timeValue, bar);
            Program.AddCustomer(foo);

            return Program.JobQueue;
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }
        //No ID param because we just want to pop the first item
        //TODO: Need good way to return both updated JobQueue and also this customer data.
        //TODO: Maybe change routing to action name http://www.asp.net/web-api/overview/web-api-routing-and-actions/routing-in-aspnet-web-api
        // DELETE api/<controller>
        public IEnumerable<Customer> Delete()
        {
            Program.JobQueue.PopFront();
            return Program.JobQueue;
        }
    }
}