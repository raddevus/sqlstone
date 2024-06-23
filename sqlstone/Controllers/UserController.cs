using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using sqlstone.Models;
using System.IO;

namespace sqlstone.Controllers;

public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private string webRootPath;
    private string contentRootPath;
    private readonly IConfiguration _config;
    
    // templateDbFile is your sqlite3 db which contains
    // all of your tables for your custom solution.
    // The name is set in the appsettings.json file.
    // You can name it anything you like.  This db will
    // be copied to each user's "file workspace" in their wwwroot/<uuid> folder
    readonly string templateDbFile;

    public UserController(ILogger<UserController> logger, 
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
    public ActionResult RegisterUser([FromQuery] string uuid){
        // Every valid UUID will have 4 hyphens & be 36 chars long
        int hyphenCounter = uuid.AsSpan().Count('-');
        if (uuid.Length != 36 || hyphenCounter != 4){
            return new JsonResult(new {result=false, error="Couldn't register user. Try again.\nUUID doesn't look valid.  Please generate a proper UUID & try again."});
        }
        Console.WriteLine($"uuid: {uuid}");
        User u = new User(uuid);
        var ipAddr = HelperTool.GetIpAddress(Request);
        
        var userDir = Path.Combine(webRootPath,uuid);
        var journalDb = Path.Combine(contentRootPath,templateDbFile);
        
        Directory.CreateDirectory(userDir);
        var userDbFile = Path.Combine(userDir,templateDbFile);
        Console.WriteLine($"userDbFile: {userDbFile}");
        if (!System.IO.File.Exists( userDbFile)){
            
            try{
                Console.WriteLine($"{journalDb} \n {userDir}");
                System.IO.File.Copy(journalDb,Path.Combine(userDir, userDbFile));
            }
            catch{
                return new JsonResult(new {result=false, error="Couldn't register user. Try again."});
            }
            UuidInfo info = new UuidInfo{Uuid=uuid,IpAddr=ipAddr};
            UuidInfoContext uuidCtx = new UuidInfoContext(contentRootPath);
            uuidCtx.Add(info);
            uuidCtx.SaveChanges();
        }
        else{
            Console.WriteLine("User is already registered.");
        }
    

        return new JsonResult(new {result=true, directory=webRootPath, ip=ipAddr});
    }

    [HttpPost]
    public ActionResult DownloadSqliteDb([FromQuery] String uuid)
    {
        var userDir = Path.Combine(webRootPath,uuid);
        var journalDb = Path.Combine(userDir,templateDbFile);
        Console.WriteLine(journalDb);
        return new PhysicalFileResult(journalDb, "application/x-sqlite3");
    }

    [HttpPost]
    public ActionResult DestroyUserAccount([FromQuery] String uuid){
        // Every valid UUID will have 4 hyphens & be 36 chars long
        int hyphenCounter = uuid.AsSpan().Count('-');
        if (uuid.Length != 36 || hyphenCounter != 4){
            return new JsonResult(new {result=false,message="Your uuid doesn't look like a valid value.\nCannot delete account."});
        }
        var userDir = Path.Combine(webRootPath,uuid);
        Directory.Delete(userDir,true);
        return new JsonResult(new {result=true,message="The user account and all associated data has been destroyed."});
    }
}