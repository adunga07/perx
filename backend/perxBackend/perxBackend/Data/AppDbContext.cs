using Microsoft.EntityFrameworkCore;
using perxBackend.Models;

namespace perxBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        DbSet<User> Users { get; set; }
        DbSet<Business> Businesses { get; set; }
        DbSet<Employee> Employees { get; set; }
        DbSet<EmployeePerx> EmployeePerxes { get; set; }
        DbSet<Employeer> Employeers { get; set; }
        DbSet<EmployeerBusiness> EmployeerBusinesses { get; set; }
        DbSet<Item> Items { get; set; }
        DbSet<ItemPerx> ItemPerxes { get; set; }
        DbSet<Perx> Perxes {  get; set; }
        DbSet<Tag> Tags { get; set; }
        DbSet<TagItem> TagsItems { get; set; }
        DbSet<TagBusiness> TagBusinesses { get; set; }
        DbSet<TransactionHistory> Transactions { get; set; }
        DbSet<EmployeeTag> EmployeeTags { get; set; }

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
                .HasForeignKey(e => e.EmployeerId);

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

        }
    }
}
