using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class CreateTripulacionDto
    {
        [Required]
        public int VueloID { get; set; }

        [Required]
        public int PersonalID { get; set; }

        [Required]
        [StringLength(50)]
        public string RolAsignado { get; set; }
    }
}
