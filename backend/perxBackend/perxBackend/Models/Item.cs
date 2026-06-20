namespace perxBackend.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Image {  get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }

        // Foreign Keys
        public int BusinessId { get; set; }

        public ICollection<Tag> Tags { get; set; }

    }
}
