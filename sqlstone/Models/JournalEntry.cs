using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

public class JournalEntry{
    public Int64 Id{get;set;}
    public String Title{get;set;}
    public String Note{get;set;}
    public String Created{get;set;}
    public String? Updated{get;set;}
    
}