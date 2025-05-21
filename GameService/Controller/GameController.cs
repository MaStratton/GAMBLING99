namespace GameService;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

[Route("Game")]
[ApiController]
public class GameController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> PlayRound([FromQuery(Name = "lobby")] String lobby, [FromHeader] String authorization)
    {
        
        authorization = authorization.Substring(7);
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(authorization);

        var userId = token.Claims.FirstOrDefault(t => t.Type == "UserId")?.Value;

        if (userId == null)
        {
            return StatusCode(401, "Bas JWT Token: Missing UserId");
        }
        
        int bet = 10;

        String[] results = Slots.Pull(ref bet);
        return StatusCode(200, results);

    }


    [HttpGet("home")]
    public async Task<IActionResult> GetHome()
    {
        var image = System.IO.File.OpenRead("./Properties/House.png");
        return File(image, "image/png");
    }
}
