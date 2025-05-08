namespace UserService;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


[Route("api/[controller]")]
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
            //User UserInDB = await _dbContext.Users.firstordefaultasync(u -> u.Email == userDTO.Email);
            User userInDB = null;
            if (userInDB != null)
            {
                return Ok(new {
                    Success = false,
                    Message = "User Exists With Given Email"
                });
            }

            User user = _mapper.Map<User>(userDTO);
            user.Password = hashPass(user.Password);

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Success = true, Message = "User created."});
            
        } 
        catch (Exception e)
        {
            return StatusCode(500, "Internal Server Error");
        }
    }

    public String hashPass(String pass)
    {
        byte[] salt = GetBytes(Environment.GetEnvironmentVariable("PASSWORD_SALT"));

        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: pass,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA512,
            iterationCount: 500,
            numBytesRequested: 64));

        Console.WriteLine(hashed);
        return hashed;
        
    }
}