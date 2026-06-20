using Microsoft.EntityFrameworkCore;
using perxBackend.Models;

namespace perxBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeePerx> EmployeePerxes { get; set; }
        public DbSet<Employeer> Employeers { get; set; }
        public DbSet<EmployeerBusiness> EmployeerBusinesses { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemPerx> ItemPerxes { get; set; }
        public DbSet<Perx> Perxes {  get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<TagItem> TagsItems { get; set; }
        public DbSet<TagBusiness> TagBusinesses { get; set; }
        public DbSet<TransactionHistory> Transactions { get; set; }
        public DbSet<EmployeeTag> EmployeeTags { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TagCategory> TagCategorys { get; set; }
        public DbSet<CategoryBusiness> CategoryBusinesses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //mapping relationshipd
            modelBuilder.Entity<Business>()
               .HasMany(e => e.Tags)
               .WithMany()
               .UsingEntity<TagBusiness>(
                   r => r.HasOne<Tag>().WithMany().HasForeignKey(e => e.TagId),
                   k => k.HasOne<Business>().WithMany().HasForeignKey(e => e.BusinessId));
            modelBuilder.Entity<Employee>()
                 .HasMany(e => e.TagsList)
                 .WithMany()
                 .UsingEntity<EmployeeTag>(
                     r => r.HasOne<Tag>().WithMany().HasForeignKey(e => e.TagId),
                     k => k.HasOne<Employee>().WithMany().HasForeignKey(e => e.EmployeeId));
            modelBuilder.Entity<Employee>()
                .HasMany(e => e.UsedProductList)
                .WithMany()
                .UsingEntity<EmployeePerx>(
                    r => r.HasOne<Perx>().WithMany().HasForeignKey(e => e.PerxId),
                    k => k.HasOne<Employee>().WithMany().HasForeignKey(e => e.EmployeeId));

            modelBuilder.Entity<Employeer>()
                .HasMany(e => e.EmployeeList)
                .WithOne(e => e.Employeer)
                .HasForeignKey(e => e.EmployeerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Employeer>()
            .HasMany(e => e.BusinessList)
            .WithMany()
            .UsingEntity<EmployeerBusiness>(
                r => r.HasOne<Business>().WithMany().HasForeignKey(e => e.BusinessId),
                l => l.HasOne<Employeer>().WithMany().HasForeignKey(e => e.EmployeerId));

            modelBuilder.Entity<Item>()
                .HasMany(e => e.Tags)
                .WithMany()
                .UsingEntity<TagItem>(
                    r => r.HasOne<Tag>().WithMany().HasForeignKey(e => e.TagId),
                    k => k.HasOne<Item>().WithMany().HasForeignKey(e => e.ItemId));
            modelBuilder.Entity<Perx>()
                .HasMany(e => e.ItemsList)
                .WithMany()
                .UsingEntity<ItemPerx>(
                    r => r.HasOne<Item>().WithMany().HasForeignKey(e => e.ItemId),
                    k => k.HasOne<Perx>().WithMany().HasForeignKey(e => e.PerxId));

            modelBuilder.Entity<TransactionHistory>()
            .HasOne<Business>()
            .WithMany(e => e.BusinessTransaction)
            .HasForeignKey(e => e.BusinessId);

            modelBuilder.Entity<TransactionHistory>()
                .HasOne<Employeer>()
                .WithMany(e => e.Transactions)
                .HasForeignKey(e => e.EmployeerId);
            modelBuilder.Entity<Business>()
                .HasMany(e => e.CategoryList)
                .WithMany(e => e.Businesses)
                .UsingEntity<CategoryBusiness>(
                    r => r.HasOne<Category>().WithMany().HasForeignKey(e => e.CategoryId),
                    k => k.HasOne<Business>().WithMany().HasForeignKey(e => e.BusinessId));
            modelBuilder.Entity<Tag>()
                .HasMany(e => e.Categories)
                .WithMany(e => e.Tags)
                .UsingEntity<TagCategory>(
                    r => r.HasOne<Category>().WithMany().HasForeignKey(e => e.CategoryId),
                    k => k.HasOne<Tag>().WithMany().HasForeignKey(e => e.TagId));
            modelBuilder.Entity<Perx>()
                .HasOne<Category>()
                .WithMany(e => e.Perxs)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);



        }
    }
}
