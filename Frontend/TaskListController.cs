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

    //Tempted to just return the one Program object, for some guarantee that everything is current. Also,
    //TODO: Rename Program to something more descriptive.
    public class TaskListController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Customer> GetCustomers()
        {
            Program.Main();
            return Program.JobQueue;
        }

        public IEnumerable<Job> GetServices()
        {
            return Program.jobList;
        }

        public TimeSpan GetBEWT()
        {
            return Program.BEWT;
        }

        public double GetBalance()
        {
            return Program.MachineBalance;
        }

        //Dammit. Can't return actual Customer, since that has too many fields to initialize
        //client-side, and can't just take object, since that can have any fields it likes.
        //Created CustomerDTO class just so we can have some actual structure.
        [HttpPost]
        public IEnumerable<Customer> NewCustomer(CustomerDTO value)
        {
            var bar = Program.jobList.First(item => item.Identifier == value.desiredJob);
            var foo = new Customer(value.name, value.timeValue, bar);
            Program.AddCustomer(foo);

            return Program.JobQueue;
        }

        //No ID param because we just want to pop the first item
        //TODO: Need good way to return both updated JobQueue and also this customer data.
        [HttpGet]
        public Customer RemoveCustomer()
        {
            return Program.RemoveCustomer();
        }
    }
}