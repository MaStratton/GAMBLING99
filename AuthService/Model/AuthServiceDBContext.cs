namespace AuthService;

using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;

public class AuthServiceDBContext : DbContext
{
    public AuthServiceDBContext(DbContextOptions<AuthServiceDBContext> options)
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