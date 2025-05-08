namespace UserService;

using AutoMapper;

public class UserAutoMapper : Profile
{
    public UserAutoMapper()
    {
        CreateMap<UserDTO, User>();
    }
}
