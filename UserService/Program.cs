using UserService;

using Microsoft.EntityFrameworkCore;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();


builder.Services.AddDbContext<UserServiceDBContext>(options =>
    options.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING"))
);
Console.WriteLine(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING"));

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();

app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.MapControllers();

app.Run();