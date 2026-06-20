using System.Net.Http.Headers;

namespace perxBackend.Models
{
    public class Employee : User
    {
        public int Id { get; set; }
        public double Budget { get; set; }
        public double Balance { get; set; }
        public string BannerImg { get; set; }
        public string ProfilePicture { get; set; }

        // Foreign Keys
        public int EmployeerId { get; set; }
        
        //Navigation Properties
        public ICollection<Tag> TagsList { get; set; }
        public ICollection<Perx> UsedProductList { get; set; }

        public Employeer Employeer { get; set; }
    }
}
