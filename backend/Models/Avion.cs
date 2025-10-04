using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.Models
{
    public class Avion
    {
        [Key]
        public int AvionID { get; set; }

        [Required]
        [StringLength(100)]
        public string Modelo { get; set; }

        [Required]
        public int Capacidad { get; set; }

        // Navigation properties
        public ICollection<Vuelo> Vuelos { get; set; } = new List<Vuelo>();
    }
}
