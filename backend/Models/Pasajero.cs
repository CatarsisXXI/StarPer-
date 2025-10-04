using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.Models
{
    public class Pasajero
    {
        [Key]
        public int PasajeroID { get; set; }

        [Required]
        [StringLength(50)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(50)]
        public string Apellido { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        [StringLength(255)]
        public string? PasswordHash { get; set; }

        // Navigation properties
        public ICollection<Boleto> Boletos { get; set; } = new List<Boleto>();
    }
}
