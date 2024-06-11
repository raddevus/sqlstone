CREATE TABLE [JEntry]
( [ID] INTEGER NOT NULL PRIMARY KEY,
  [Title] NVARCHAR(250) NOT NULL check(length(Title) <= 250),
  [Note] NVARCHAR(250) NOT NULL check(length(Title) <= 3000),
  [Created] NVARCHAR(30) default (datetime('now','localtime')) 
  check(length(Created) <= 30),
  [Updated] NVARCHAR(30) check(length(Updated) <= 30)
)
