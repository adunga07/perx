namespace perxBackend.Models
{
    public class TransactionHistory
    {
        public int Id { get; set; }
        public int EmployeerId { get; set; }
        public int BusinessId { get; set; }
        public DateTime TransactionDate { get; set; }
        //public double Ammount { get; set; }
    }
}
