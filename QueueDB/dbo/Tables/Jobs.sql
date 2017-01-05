CREATE TABLE [dbo].[Jobs] (
    [JobId]  INT            IDENTITY (1, 1) NOT NULL,
    [Name]   NVARCHAR (MAX) NULL,
    [Length] TIME (7)       NOT NULL,
    CONSTRAINT [PK_dbo.Jobs] PRIMARY KEY CLUSTERED ([JobId] ASC)
);

