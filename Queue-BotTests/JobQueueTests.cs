using Xunit;
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
            Customer[] customerList = {
                new Customer { Name = "Bob", AuthId = "asdkfljakdf" },
                new Customer { Name = "Gerald", AuthId = "adsfasdf" }
            };
            mockedRepo.Setup(request => request.getJobs()).Returns(jobList);
            mockedRepo.Setup(request => request.getCustomers()).Returns(customerList);
            mockedRepo.Setup(request => request.addTask(It.IsAny<Task>())).Returns((Task newTask) => newTask);
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
        }

    }
}