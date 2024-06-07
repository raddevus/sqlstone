using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using sqlstone.Models;

namespace sqlstone.Controllers;

public class UserController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private string webRootPath;

    public UserController(ILogger<HomeController> logger, IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        Console.WriteLine($"content rootPath: {webHostEnvironment.WebRootPath}");
        webRootPath = webHostEnvironment.WebRootPath;
    }

    [HttpGet]
    public ActionResult RegisterUser(string guid){
        User u = new User(guid);
        var ipAddr = HelperTool.GetIpAddress(Request);
        return new JsonResult(new {result=true, directory=webRootPath, ip=ipAddr});
    }

}