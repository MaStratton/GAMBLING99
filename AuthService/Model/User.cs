namespace AuthService;

using System.ComponentModel.DataAnnotations;

public class User
{

    [Key]
    public int UserId { get; set; }

    [Required]
    public String Username { get; set; }

    [Required]
    public String Password { get; set; }

    [Required]
    public String Email { get; set; }

    [Required] 
    public String Role { get; set; }

}
