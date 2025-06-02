namespace GameService;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;


[Route("game")]
[ApiController]
public class GameController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> PlayRound([FromHeader] String authorization)
    {
        
        authorization = authorization.Substring(7);
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(authorization);

        var userId = token.Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return StatusCode(401, "Bad JWT Token: Missing UserId");
        }
        
        int bet = 10;

        String[] results = Slots.Pull(ref bet);

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", authorization);

            var response = await client.GetAsync($"http://LobbyServiceAPI:8080/lobby/{userId}/money");
            var responseBodyString = await response.Content.ReadAsStringAsync();

            var responseBodyJson = JsonDocument.Parse(responseBodyString);


            int currBalance = responseBodyJson.RootElement.GetProperty("money").GetInt32() + bet;

            using StringContent patchContent = new(JsonSerializer.Serialize(new { new_balance = currBalance }), Encoding.UTF8, "application/json");

            var PatchResponse = await client.PatchAsync($"http://LobbyServiceAPI:8080/lobby/{userId}", patchContent);

            var patchResponseString = await response.Content.ReadAsStringAsync();
        }
        return StatusCode(200, results);

    }


    [HttpGet("home")]
    public async Task<IActionResult> GetHome()
    {
        var image = System.IO.File.OpenRead("./Properties/House.png");
        return File(image, "image/png");
    }
}
