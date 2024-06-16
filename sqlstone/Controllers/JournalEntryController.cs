using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using sqlstone.Models;
using System.IO;

namespace sqlstone.Controllers;

public class JournalEntryController : Controller
{
    private readonly ILogger<JournalEntryController> _logger;

    private string webRootPath;
    private string contentRootPath;

    IConfiguration _configuration;

    // templateDbFile is your sqlite3 db which contains
    // all of your tables for your custom solution.
    // The name is set in the appsettings.json file.
    // You can name it anything you like.  This db will
    // be copied to each user's "file workspace" in their wwwroot/<uuid> folder
    readonly string templateDbFile;

    public JournalEntryController(ILogger<JournalEntryController> logger, 
            IConfiguration _configuration,
            IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        templateDbFile = _configuration["templateDbFile"];
        Console.WriteLine($"content rootPath: {webHostEnvironment.WebRootPath}");
        webRootPath = webHostEnvironment.WebRootPath;
        contentRootPath = webHostEnvironment.ContentRootPath;
    }

    [HttpPost]
    public ActionResult GetAll([FromForm] string uuid){
        var userDir = Path.Combine(webRootPath,uuid);
        var userDbFile = Path.Combine(userDir,templateDbFile);

        if (!System.IO.File.Exists(userDbFile)){
            return new JsonResult(new {result="No data"});
        }
        
        JournalEntryContext jec = new JournalEntryContext(userDbFile);

        // var entries = jec.JEntry.Where<JournalEntry>((je) => je.Id == 50);
        var entries = jec.JEntry;
        
        List<JournalEntry> allItems = new List<JournalEntry>();

        foreach (JournalEntry je in entries.AsParallel<JournalEntry>()){
            Console.WriteLine($"{je.Id} : {je.Title} : {je.Note}");
            allItems.Add(je);
        }

        // allItems.Add(new {id=0,title="WebAPI one",note="first data from webapi!",created="2024-04-04",updated=""});
        // allItems.Add(new {id=1,title="WebAPI 2nd one",note="API - Anyone running a small-biz SaaS & making $$$?",created="2024-04-06",updated=""});

        return new JsonResult(allItems);
    }

    [HttpPost]
    public ActionResult Save([FromHeader] String uuid,[FromBody] JournalEntry jentry){
        Console.WriteLine(jentry.Note);
        Console.WriteLine(jentry.Title);
        
        ConvertEmptyStringToNull(jentry);
        var userDir = Path.Combine(webRootPath,uuid);
        var userDbFile = Path.Combine(userDir,templateDbFile);
        try{
            JournalEntryContext jec = new JournalEntryContext(userDbFile);
            // id = 0 indicates a new jentry
            if (jentry.Id == 0){
                jec.Add(jentry);
            }
            else{
                JournalEntry? currentEntry = jec.Find<JournalEntry>(jentry.Id);
                currentEntry.Note = jentry.Note;
                currentEntry.Title = jentry.Title;
                currentEntry.Updated = DateTime.Now.ToString("yyyy-MM-dd");
                jec.Update(currentEntry);   
            }
            jec.SaveChanges();
            
        }
        catch (Exception ex){
            // It's possible that the user has attempted to save an Entry
            // but has never registered the UUID they see in their text box.
            return new JsonResult(new {success=false,error=$"{ex.Message}"});
        }

        return new JsonResult(new {success=true});
    }

    public void ConvertEmptyStringToNull(JournalEntry jentry){
        if (jentry.Title == String.Empty || jentry.Title == "null"){
            jentry.Title = null;
        }
        if (jentry.Updated == String.Empty || jentry.Updated == "null"){
            jentry.Updated = null;
        }
    }
}

public record Uuid{
    public string uuid{get;set;}
}