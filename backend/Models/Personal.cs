using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.Models
{
    public class Personal
    {
        [Key]
        public int PersonalID { get; set; }

        [Required]
        [StringLength(50)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(50)]
        public string Apellido { get; set; }

        [Required]
        [StringLength(50)]
        public string Puesto { get; set; }

        // Navigation properties
        public ICollection<VueloTripulacion> VueloTripulacion { get; set; } = new List<VueloTripulacion>();
    }
}
