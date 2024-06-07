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
        UuidInfo info = new UuidInfo{Uuid=uuid,IpAddr=ipAddr};
        UuidInfoContext uuidCtx = new UuidInfoContext(contentRootPath);
        uuidCtx.Add(info);
        uuidCtx.SaveChanges();

        return new JsonResult(new {result=true, directory=webRootPath, ip=ipAddr});
    }

}