using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
public class JournalEntryContext: DbContext{
    public DbSet<JournalEntry> JEntry { get; set; }
    public string DbPath { get; }


    public JournalEntryContext(string userDbPath)
    {
        DbPath = userDbPath;
        Console.WriteLine(DbPath);

         SqliteConnection connection = new SqliteConnection($"Data Source={DbPath}");
        // ########### FYI THE DB is created when it is OPENED ########
        connection.Open();
        SqliteCommand command = connection.CreateCommand();

    }

     protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}