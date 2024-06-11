using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using sqlstone.Models;
using System.IO;

namespace sqlstone.Controllers;

public class UserController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private string webRootPath;
    private string contentRootPath;

    const string journalTemplateDbFile = "sqlstone_journal.db";

    public UserController(ILogger<HomeController> logger, IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        Console.WriteLine($"content rootPath: {webHostEnvironment.WebRootPath}");
        webRootPath = webHostEnvironment.WebRootPath;
        contentRootPath = webHostEnvironment.ContentRootPath;
    }

    [HttpPost]
    public ActionResult RegisterUser([FromQuery] string uuid){
        Console.WriteLine($"uuid: {uuid}");
        User u = new User(uuid);
        var ipAddr = HelperTool.GetIpAddress(Request);
        
        var userDir = Path.Combine(webRootPath,uuid);
        var journalDb = Path.Combine(contentRootPath,journalTemplateDbFile);
        
        Directory.CreateDirectory(userDir);
        var userDbFile = Path.Combine(userDir,journalTemplateDbFile);
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

}