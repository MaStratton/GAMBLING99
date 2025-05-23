namespace UserService;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;


[Route("User")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserServiceDBContext _dbContext;
    
    private readonly IMapper _mapper;

    public UsersController(UserServiceDBContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserDTO userDTO)
    {
        try
        {

            String regex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$";

            if (!new Regex(regex).IsMatch(userDTO.Email))
            {

                return StatusCode(400, "Invalid Email");
            }

                bool userInDB = await _dbContext.Users.AnyAsync(u => u.Email == userDTO.Email || u.Username == userDTO.Username);
                if (userInDB)
                {
                    return Ok(new
                    {
                        Success = false,
                        Message = "Username or Email Exists"
                    });
                }


                User user = _mapper.Map<User>(userDTO);


            user.Password = hashPass(user.Password);
            user.Role = "USER";


            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Success = true, Message = "User created."});
            
        } 
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, "Internal Server Error");
        }
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
