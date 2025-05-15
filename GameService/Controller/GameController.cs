namespace GameService;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[Route("Game")]
[ApiController]
public class GameController : ControllerBase
{
    [HttpGet("home")]
    public async Task<IActionResult> GetHome()
    {
        var image = System.IO.File.OpenRead("./Properties/House.png");
        return File(image, "image/png");
    }
}
