namespace perxBackend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Business> Businesses { get; set; }
        public ICollection<Perx> Perxs { get; set; }
    }
}
