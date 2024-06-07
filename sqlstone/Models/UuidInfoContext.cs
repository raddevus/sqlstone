using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;

public class UuidInfoContext: DbContext{
    public DbSet<UuidInfo> UuidInfo { get; set; }
    public string DbPath { get; }

    public UuidInfoContext(string dbRootPath)
    {
        DbPath = System.IO.Path.Join(dbRootPath, "sqlstone.db");
        Console.WriteLine(DbPath);
        
        SqliteConnection connection = new SqliteConnection($"Data Source={DbPath}");
        // ########### FYI THE DB is created when it is OPENED ########
        connection.Open();
        SqliteCommand command = connection.CreateCommand();
        FileInfo fi = new FileInfo(DbPath);
        // check to see if db file is 0 length, if so, it needs to have table added
        if (fi.Length == 0){
            foreach (String tableCreate in allTableCreation){
                command.CommandText = tableCreate;
                command.ExecuteNonQuery();
            }
        }
    }

    // configures the database for use by EF
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
    protected String [] allTableCreation = {
        @"CREATE TABLE UuidInfo
            (
            [ID] INTEGER NOT NULL PRIMARY KEY,
            [Uuid] NVARCHAR(36) NOT NULL check(length(Uuid) <= 36),
            [IpAddr] NVARCHAR(39) NOT NULL check(length(IpAddr) <= 39),
            [Created] NVARCHAR(30) default (datetime('now','localtime')) 
                      check(length(Created) <= 30)
            )"
    };
}