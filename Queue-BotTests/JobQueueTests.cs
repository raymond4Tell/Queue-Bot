using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Ploeh.AutoFixture;
using System.Threading;

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
            mockedRepo.Setup(request => request.addTask(It.IsAny<Task>())).Returns((Task newTask) =>
            {
                newTask.taskStatus = 0; newTask.TaskId = Guid.NewGuid();
                newTask.timeEnqueued = DateTime.Now; newTask.timeOfExpectedService = DateTime.Now.AddHours(1); return newTask;
            })
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
            Customer bob = fixtureGen.Build<Customer>().Without(x => x.requestedJobs).Create();
            Job requestedJob = testingQueue.jobList.First();
            var newTask = testingQueue.AddCustomer(new Task { customer = bob, job = requestedJob, timePrice = 1.2 });
            Assert.Equal(newTask.job, requestedJob);
            Assert.Equal(newTask.customer, bob);
            Assert.Equal(newTask.timePrice, 1.2);
            Assert.Contains(testingQueue.customerList, item => item == bob);
            Assert.Contains(testingQueue.queueStatus.internalQueue, item => item == newTask);
        }


        [Fact()]
        public void updateTaskTest()
        {
            Fixture fixtureGen = new Fixture();
            Customer bob = fixtureGen.Build<Customer>().Without(x => x.requestedJobs).Create();
            Job requestedJob = testingQueue.jobList.First();
            var bar = testingQueue.AddCustomer(new Task { customer = bob, job = requestedJob, timePrice = 1.2 });
            var foo = testingQueue.queueStatus.internalQueue.First();
            Assert.Equal(bar.customer, foo.customer);
            Assert.Equal(bar.job, foo.job);
            var deposit = fixtureGen.Create<int>();
            foo.deposit = deposit;
            testingQueue.updateTask(foo, foo.TaskId);
            var baz = testingQueue.queueStatus.internalQueue.First();
            Assert.Equal(baz.deposit, deposit);
            Assert.Equal(baz.TaskId, foo.TaskId);
        }

        [Fact()]
        public void RemoveCustomerTest()
        {
            Fixture fixtureGen = new Fixture();
            Customer bob = fixtureGen.Build<Customer>().Without(x => x.requestedJobs).Create();
            Customer baz = fixtureGen.Build<Customer>().Without(x => x.requestedJobs).Create();
            Job requestedJob = testingQueue.jobList.First();
            var foo = testingQueue.AddCustomer(new Task { customer = bob, job = requestedJob, timePrice = 50 });
            Thread.Sleep(30 * 1000);
            requestedJob = testingQueue.jobList.ElementAt(new Random().Next(testingQueue.jobList.Count()));
            var qux = testingQueue.AddCustomer(new Task { customer = baz, job = requestedJob, timePrice = 1 });
            Assert.Equal(foo.taskStatus, 0);
            var bar = testingQueue.RemoveCustomer();
            Assert.Equal(foo, bar);
            Assert.Equal(bar.taskStatus, 1);
            Assert.True(bar.Balance < 0);
            Assert.Equal(bar.Balance, -1 * testingQueue.MachineBalance);
        }
    }
}