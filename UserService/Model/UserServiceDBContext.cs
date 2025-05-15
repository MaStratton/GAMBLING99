namespace UserService;

using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;

public class UserServiceDBContext : DbContext
{
    public UserServiceDBContext(DbContextOptions<UserServiceDBContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; } = null;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.UserId);
            entity.HasIndex(u => u.Email)
                .IsUnique();
            entity.Property(u => u.Password);
        });
    }

}