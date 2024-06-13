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
    const string journalTemplateDbFile = "sqlstone_journal.db";

    public JournalEntryController(ILogger<JournalEntryController> logger, IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        Console.WriteLine($"content rootPath: {webHostEnvironment.WebRootPath}");
        webRootPath = webHostEnvironment.WebRootPath;
        contentRootPath = webHostEnvironment.ContentRootPath;
    }

    [HttpPost]
    public ActionResult GetAll([FromForm] string uuid){
        var userDir = Path.Combine(webRootPath,uuid);
        var userDbFile = Path.Combine(userDir,journalTemplateDbFile);
        
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
    public ActionResult Save([FromForm] String uuid, [FromForm] JournalEntry jentry){
        Console.WriteLine(jentry.Note);
        Console.WriteLine(jentry.Title);
        var userDir = Path.Combine(webRootPath,uuid);
        var userDbFile = Path.Combine(userDir,journalTemplateDbFile);
        JournalEntryContext jec = new JournalEntryContext(userDbFile);
        jec.Add(jentry);
        jec.SaveChanges();

        return new JsonResult(new {result="success"});
    }

}