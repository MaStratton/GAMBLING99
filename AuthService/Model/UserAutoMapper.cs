namespace AuthService;

using AutoMapper;

public class UserAutoMapper : Profile
{
    public UserAutoMapper()
    {
        CreateMap<UserDTO, User>();
    }
}
