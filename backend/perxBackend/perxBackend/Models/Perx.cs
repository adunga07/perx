using Microsoft.AspNetCore.DataProtection;

namespace perxBackend.Models
{
    public class Perx
    {
        public int Id { get; set; }
        public double Price { get; set; }
        public double Discount { get; set; }
        public int Availability { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int BusinessId { get; set; }

        public ICollection<Tag> TagsList { get; set; }
        public ICollection<Item> ItemsList { get; set; }
        public ICollection<string> Benefits { get; set; }

    }
}
