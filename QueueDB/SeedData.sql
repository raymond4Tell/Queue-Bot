/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
 //Job[] jobList = {new Job(new TimeSpan(2, 0, 0) , "Rotate tires"),
    //        new Job(TimeSpan.FromHours(.5), "Hoover the roof") ,
    //        new Job(new TimeSpan(1, 40, 0),  "Square the circle"),
    //        new Job(new TimeSpan(2, 30,0),  "Empty liquor cabinet"),
    //        new Job(new TimeSpan(3, 0,0), "Destroy watermelons")
    //    };

    //var bob = new Customer { Name = "Bob", AuthId = "asdkfljakdf" };
    //context.Tasks.Add(new Task
    //{
    //    deposit = 0,
    //    AuthID = bob.AuthId,
    //    customer = bob,
    //    job = jobList[2],
    //    jobId = jobList[2].JobId,
    //    taskStatus = "Waiting",
    //    timeEnqueued = DateTime.Now,
    //    timeOfExpectedService = DateTime.Now.AddHours(1),
    //    timePrice = 1.2,
    //    TaskId = Guid.NewGuid()
    //});
    //context.Tasks.Add(new Task
    //{
    //    deposit = 0,
    //    AuthID = "u890asdf",
    //    customer = new Customer { Name = "Gerald", AuthId = "u890asdf" },
    //    job = jobList[1],
    //    jobId = jobList[1].JobId,
    //    taskStatus = "Waiting",
    //    timeEnqueued = DateTime.Now,
    //    timeOfExpectedService = DateTime.Now.AddHours(1),
    //    timePrice = 4.1,
    //    TaskId = Guid.NewGuid()
    //});
*/
 SET IDENTITY_INSERT jobs ON 
    GO 
-- Reference Data for Jobs 
MERGE INTO jobs AS Target 
USING (VALUES 
	(1, N'Square the circle', N'01:40:00', N'Produce a square with the same area as a circle of unit radius, using only compass and straightedge'),
	(2, N'Hoover the roof', N'00:30:00', N'The roof is filthy and needs to be cleaned'),
	(3, N'Rotate tires', N'02:00:00', N'A vital part of car maintenance which must be done regularly'),
	(4, N'Empty liquor cabinet', N'02:30:00', N'All those bottles are cluttering up the place, and must be emptied before they are recycled'),
	(5, N'Explode watermelons', N'03:00:00', N'I love the smell of watermelon in the morning.')
) 
AS Source (jobid, Name, length, description ) 
ON Target.jobId = Source.jobId 
-- update matched rows 
WHEN MATCHED THEN 
UPDATE SET Name = Source.Name, description = source.description 
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
	INSERT (jobid, name, length, description) 
	VALUES (jobid, Name, length, description)
WHEN NOT MATCHED BY SOURCE THEN 
	DELETE;
SET IDENTITY_INSERT jobs OFF 
    GO 

	
-- Reference Data for Customers 
MERGE INTO Customers AS Target 
USING (VALUES 
	('Bob', 'asdkfljakdf' ),
	('Gerald', 'u890asdf' )
) AS Source (Name, authid )
ON Target.authid = Source.authid 
-- update matched rows 
WHEN MATCHED THEN 
UPDATE SET Name = Source.Name
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (authid, name) 
VALUES (authid, Name)
WHEN NOT MATCHED BY SOURCE THEN 
DELETE;

-- Reference Data for Tasks
--	[TaskId]                UNIQUEIDENTIFIER NOT NULL,
--  [AuthID]                NVARCHAR (128)   NULL,
--    [jobId]                 INT              NOT NULL,
--    [taskStatus]            NVARCHAR (MAX)   NULL,
--    [customerNotes]         NVARCHAR (MAX)   NULL,
--    [adminNotes]            NVARCHAR (MAX)   NULL,
--    [timePrice]             FLOAT (53)       NOT NULL,
--    [timeEnqueued]          DATETIME         NOT NULL,
--    [timeOfExpectedService] DATETIME         NOT NULL,
--    [deposit]              money      NOT NULL,
--    [Balance]               money       NOT NULL,
    
MERGE INTO Tasks AS Target 
USING (VALUES 
	(newid(), 'asdkfljakdf', 2,'Waiting', '', '', 4.8,getdate(), dateadd(hour, 1, getdate()), 0 , 0 ),
	(newid(), 'u890asdf', 4,'Waiting', '', '', 2.1,getdate(), dateadd(hour, 1, getdate()), 0 , 0   )
) AS Source (taskid, authid, jobid, taskStatus, customerNotes, adminnotes, timeprice, timeenqueued, timeofexpectedservice,
deposit, balance )
ON Target.taskid = Source.taskid 
-- update matched rows 
WHEN MATCHED THEN 
UPDATE SET authid = source.authid
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (taskid, authid, jobid, taskStatus, customerNotes, adminnotes, timeprice, timeenqueued, timeofexpectedservice,
deposit, balance ) 
VALUES (taskid, authid, jobid, taskStatus, customerNotes, adminnotes, timeprice, timeenqueued, timeofexpectedservice,
deposit, balance )
WHEN NOT MATCHED BY SOURCE THEN 
DELETE;