CREATE TABLE [dbo].[TaskStatus]
(
	[StatusId] INT NOT NULL PRIMARY KEY identity(1,1),
	[Status] nvarchar(max) not null
)
