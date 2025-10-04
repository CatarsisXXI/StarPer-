using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class CreatePersonalDto
    {
        [Required]
        [StringLength(50)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(50)]
        public string Apellido { get; set; }

        [Required]
        [StringLength(50)]
        public string Puesto { get; set; }
    }
}
