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
    public ActionResult GetAllJournalEntries([FromForm] string uuid){
        var userDir = Path.Combine(webRootPath,uuid);
        var userDbFile = Path.Combine(userDir,journalTemplateDbFile);
        return new JsonResult(new {gargage="test"});
    }



}