using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class CreateAvionDto
    {
        [Required]
        [StringLength(100)]
        public string Modelo { get; set; }

        [Required]
        [Range(1, 1000)]
        public int Capacidad { get; set; }
    }
}
