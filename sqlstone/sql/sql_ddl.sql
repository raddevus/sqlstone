CREATE TABLE [JEntry]
( [ID] INTEGER NOT NULL PRIMARY KEY,
  [Title] NVARCHAR(250) check(length(Title) <= 250),
  [Note] NVARCHAR(3000) NOT NULL check(length(Title) <= 3000),
  [Created] NVARCHAR(30) default (datetime('now','localtime')) 
  check(length(Created) <= 30),
  [Updated] NVARCHAR(30) check(length(Updated) <= 30)
)
