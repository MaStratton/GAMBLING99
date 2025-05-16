namespace AuthService;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;


[Route("Auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthServiceDBContext _dbContext;

    private readonly IMapper _mapper;

    public AuthController(AuthServiceDBContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> getJWT([FromBody] UserDTO userDTO)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email);
        
        if (user == null)
        {
            return Unauthorized();
        }

        if (!hashPass(userDTO.Password).Equals(user.Password))
        {
            return Unauthorized();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new("UserId", user.UserId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds);
        
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(tokenString);
    }

    [HttpGet("home")]
    public async Task<IActionResult> GetHome()
    {
        var image = System.IO.File.OpenRead("./Properties/House.png");
        return File(image, "image/png");
    }
    
    public String hashPass(String pass)
    {
        byte[] passByte = Encoding.UTF8.GetBytes(pass);
        byte[] salt = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("PASSWORD_SALT"));
        byte[] saltedPass = new byte[passByte.Length + salt.Length];
        passByte.CopyTo(saltedPass, 0);
        salt.CopyTo(saltedPass, passByte.Length);
        using (SHA512 shaM = SHA512.Create())
        {
        byte[] hash = shaM.ComputeHash(saltedPass);
        return BitConverter.ToString(hash).Replace("-", "").ToLower();    
        }
    }
    
}

