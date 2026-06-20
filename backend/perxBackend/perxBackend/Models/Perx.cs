using Microsoft.AspNetCore.DataProtection;
using perxBackend.Models.Enums;

namespace perxBackend.Models
{
    public class Perx
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public double Price { get; set; }
        public double Discount { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public int BusinessId { get; set; }
        public int CategoryId { get; set; }
        public Status Status { get; set; }
        public int Used { get; set; }

        public ICollection<Tag> TagsList { get; set; }
        public ICollection<Item> ItemsList { get; set; }
        public ICollection<string> Benefits { get; set; }
        public Category PerxCategory { get; set; }

    }
}
