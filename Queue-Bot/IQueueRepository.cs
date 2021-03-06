﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Queue_Bot
{
    public interface IQueueRepository
    {
        Task addTask(Task newTask);
        Customer addCustomer(Customer newCustomer);
        IEnumerable<Job> getJobs();
        IEnumerable<Task> getTasksAll();
        IEnumerable<Task> getTasksForQueue();
        Task getTaskById(Guid taskId);
        IEnumerable<Customer> getCustomers();
        Task updateTask(Task changedTask);
    }
}
