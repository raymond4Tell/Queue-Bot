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

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}