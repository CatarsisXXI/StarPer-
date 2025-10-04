using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.Models
{
    public class Administrador
    {
        [Key]
        public int AdminID { get; set; }

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

        [Required]
        [StringLength(200)]
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(50)]
        public string Rol { get; set; } = "Administrador";
    }
}
