using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Section15.Models;

#nullable disable

namespace Section15.DbContexts
{
  public partial class ChiuDbContext : DbContext
  {
    public ChiuDbContext(DbContextOptions<ChiuDbContext> options)
            : base(options)
    {
    }

    public virtual DbSet<Coupon> Coupons { get; set; }
    public virtual DbSet<Ingredient> Ingredients { get; set; }
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Receipt> Receipts { get; set; }
    public virtual DbSet<ReceiptDetail> ReceiptDetails { get; set; }
    public virtual DbSet<Recipe> Recipes { get; set; }
    public virtual DbSet<Shift> Shifts { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      if (!optionsBuilder.IsConfigured)
      {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        optionsBuilder.UseMySql("server=localhost;port=3306;database=chiudb;user=dbadmin;password=Dangdeptrai97", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.24-mariadb"));
      }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.HasCharSet("utf8mb4")
          .UseCollation("utf8mb4_general_ci");

      modelBuilder.Entity<Coupon>(entity =>
      {
        entity.ToTable("coupon");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.Code).HasMaxLength(45);

        entity.Property(e => e.DiscountPercent).HasColumnType("int(11)");
      });

      modelBuilder.Entity<Ingredient>(entity =>
      {
        entity.ToTable("ingredient");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.Name).HasMaxLength(45);

        entity.Property(e => e.OtherInfo).HasMaxLength(45);

        entity.Property(e => e.Unit).HasMaxLength(45);
      });

      modelBuilder.Entity<Product>(entity =>
      {
        entity.ToTable("product");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.CategoryId).HasColumnType("int(11)");

        entity.Property(e => e.Name).HasMaxLength(50);

        entity.Property(e => e.Price).HasColumnType("int(11)");
      });

      modelBuilder.Entity<Receipt>(entity =>
      {
        entity.ToTable("receipt");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.CheckOutTime).HasColumnType("datetime");

        entity.Property(e => e.Coupon).HasMaxLength(45);

        entity.Property(e => e.Discount).HasColumnType("int(11)");

        entity.Property(e => e.Note).HasMaxLength(50);

        entity.Property(e => e.OrderId).HasColumnType("int(11)");

        entity.Property(e => e.PrintCount).HasColumnType("int(11)");

        entity.Property(e => e.PrintTime).HasColumnType("datetime");

        entity.Property(e => e.ShiftId).HasColumnType("int(11)");

        entity.Property(e => e.Summary).HasColumnType("int(11)");

        entity.Property(e => e.Table).HasMaxLength(45);

        entity.Property(e => e.Time).HasColumnType("datetime");

        entity.Property(e => e.Total).HasColumnType("int(11)");

        entity.Property(e => e.UserId).HasColumnType("int(11)");
      });

      modelBuilder.Entity<ReceiptDetail>(entity =>
      {
        entity.ToTable("receiptdetail");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.Price).HasColumnType("int(11)");

        entity.Property(e => e.ProductId).HasColumnType("int(11)");

        entity.Property(e => e.Quantity).HasColumnType("int(11)");

        entity.Property(e => e.ReceiptId).HasColumnType("int(11)");
      });

      modelBuilder.Entity<Recipe>(entity =>
      {
        entity.ToTable("recipe");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.Amount).HasColumnType("int(11)");

        entity.Property(e => e.IngredientId).HasColumnType("int(11)");

        entity.Property(e => e.Note).HasMaxLength(45);

        entity.Property(e => e.ProductId).HasColumnType("int(11)");
      });

      modelBuilder.Entity<Shift>(entity =>
      {
        entity.ToTable("shift");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.EndTime).HasColumnType("datetime");

        entity.Property(e => e.StartTime).HasColumnType("datetime");

        entity.Property(e => e.Status).HasMaxLength(45);

        entity.Property(e => e.Summary).HasColumnType("int(11)");
      });

      modelBuilder.Entity<User>(entity =>
      {
        entity.ToTable("user");

        entity.Property(e => e.Id).HasColumnType("int(11)");

        entity.Property(e => e.Password)
            .IsRequired()
            .HasMaxLength(45);

        entity.Property(e => e.UserName)
            .IsRequired()
            .HasMaxLength(45);
      });

      OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
  }
}
