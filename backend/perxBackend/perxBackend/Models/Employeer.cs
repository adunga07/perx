
namespace perxBackend.Models
{
    public class Employeer : User
    {
        public int Id { get; set; }
        public string NIPT { get; set; }
        public int AccountNumber { get; set; }
        public string CompanyName { get; set; }
        public string Logo { get; set; }
        public string BannerImg { get; set; }
        //public ICollection<Perx> PerksList { get; set; }
        public ICollection<Employee> EmployeeList { get; set; }
        public ICollection<Business> BusinessList { get; set; }
    }
}