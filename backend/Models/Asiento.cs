using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StarPeru.Api.Models
{
    public class Asiento
    {
        [Key]
        public int AsientoID { get; set; }

        [Required]
        public int VueloID { get; set; }

        [Required]
        [StringLength(10)]
        public string NumeroAsiento { get; set; }

        [Required]
        public bool Disponible { get; set; } = true;

        // Navigation properties
        [ForeignKey("VueloID")]
        public Vuelo Vuelo { get; set; }

        public Boleto Boleto { get; set; }
    }
}
