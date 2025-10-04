using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class CreateAsientoDto
    {
        [Required]
        public int VueloID { get; set; }

        [Required]
        [StringLength(10)]
        public string NumeroAsiento { get; set; }

        [Required]
        public bool Disponible { get; set; } = true;
    }
}
