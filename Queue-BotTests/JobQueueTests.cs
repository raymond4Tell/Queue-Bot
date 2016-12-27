﻿using Xunit;
using Moq;

using Queue_Bot;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;
using Ploeh.AutoFixture.Xunit2;


namespace Queue_Bot.Tests
{
    public class JobQueueTests
    {
        private JobQueue testingQueue;
        public JobQueueTests()
        {
            var mockedRepo = new Mock<IQueueRepository>();
            Job[] jobList = {
                new Job(new TimeSpan(2, 0, 0) , "Rotate tires"),
                   new Job(TimeSpan.FromHours(.5), "Hoover the roof") ,
                   new Job(new TimeSpan(1, 40, 0),  "Square the circle"),
                   new Job(new TimeSpan(2, 30,0),  "Empty liquor cabinet"),
                   new Job(new TimeSpan(3, 0,0), "Destroy watermelons")
                };
            List<Customer> customerList = new List<Customer> {
                new Customer { Name = "Bob", AuthId = "asdkfljakdf" },
                new Customer { Name = "Gerald", AuthId = "adsfasdf" }
            };
            List<Task> taskList = new List<Task>();
            mockedRepo.Setup(request => request.getJobs()).Returns(jobList);
            mockedRepo.Setup(request => request.getCustomers()).Returns(customerList);
            mockedRepo.Setup(request => request.addTask(It.IsAny<Task>())).Returns((Task newTask) => newTask)
                .Callback<Task>(newTask => taskList.Add(newTask));
            mockedRepo.Setup(request => request.addCustomer(It.IsAny<Customer>())).Returns((Customer newCustomer) => newCustomer)
                .Callback<Customer>(newCustomer => customerList.Add(newCustomer));

            mockedRepo.Setup(request => request.getTasksAll()).Returns(taskList);
            testingQueue = new JobQueue(mockedRepo.Object);
        }
        [Fact()]
        public void AddCustomerTest()
        {
            Fixture fixtureGen = new Fixture();
            Customer bob = fixtureGen.Create<Customer>();
            Job requestedJob = testingQueue.jobList.First();
            var newTask = testingQueue.AddCustomer(bob, requestedJob, 1.2);
            Assert.Equal(newTask.job, requestedJob);
            Assert.Equal(newTask.customer, bob);
            Assert.Equal(newTask.timePrice, 1.2);
            Assert.Contains(testingQueue.customerList, item => item == bob);
            Assert.Contains(testingQueue.queueStatus.internalQueue, item => item == newTask);
        }


        [Fact()]
        public void updateTaskTest()
        {
            var foo = testingQueue.queueStatus.internalQueue.First();
            Assert.True(false, "This test needs an implementation");
        }

        [Fact()]
        public void RemoveCustomerTest()
        {
            Assert.True(false, "This test needs an implementation");
        }
    }
}