CREATE TABLE [dbo].[Customers] (
    [AuthId] NVARCHAR (128) NOT NULL,
    [Name]   NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.Customers] PRIMARY KEY CLUSTERED ([AuthId] ASC)
);

