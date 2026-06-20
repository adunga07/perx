using perxBackend.Models.Enums;

namespace perxBackend.Models
{
    public class EmployeePerx
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int PerxId { get; set; }
        public Status Status { get; set; }

        // extra employeer id for easier navigation
        public int EmployeerId { get; set; }
    }
}
