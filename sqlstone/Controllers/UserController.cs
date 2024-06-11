using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using sqlstone.Models;

namespace sqlstone.Controllers;

public class UserController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private string webRootPath;
    private string contentRootPath;

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

        if (!Directory.Exists(userDir)){
            Directory.CreateDirectory(userDir);
            if (!System.IO.File.Exists( Path.Combine(userDir,"sqlstoneu.db"))){
                UuidInfo info = new UuidInfo{Uuid=uuid,IpAddr=ipAddr};
                UuidInfoContext uuidCtx = new UuidInfoContext(contentRootPath);
                uuidCtx.Add(info);
                uuidCtx.SaveChanges();
            }
            else{
                Console.WriteLine("User is already registered.");
            }
        }

        return new JsonResult(new {result=true, directory=webRootPath, ip=ipAddr});
    }

}