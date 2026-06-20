namespace perxBackend.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string BusinessName { get; set; }
        public string NIPT {  get; set; }
        public string AccountNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Logo {  get; set; }
        public string BannerImg { get; set; }

        public ICollection<Tag> Tags { get; set; }
        public ICollection<TransactionHistory> BusinessTransaction { get; set; }
    }
}
