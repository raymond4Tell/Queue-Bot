using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Queue_Bot;

namespace App.Frontend
{
    [HubName("JobList")]
    public class JobHub : Hub
    {
        public void Hello()
        {
            Clients.All.refreshJobs(Program.JobQueue);
        }

        public void RefreshJobs()
        {
            Clients.All.Clients.All.refreshJobs(Program.JobQueue);
        }
    }
}