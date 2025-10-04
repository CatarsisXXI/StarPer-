using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StarPeru.Api.Models
{
    public class Boleto
    {
        [Key]
        public int BoletoID { get; set; }

        [Required]
        public int PasajeroID { get; set; }

        [Required]
        public int VueloID { get; set; }

        [Required]
        public int AsientoID { get; set; }

        [Required]
        public DateTime FechaCompra { get; set; } = DateTime.Now;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        // Navigation properties
        [ForeignKey("PasajeroID")]
        public Pasajero Pasajero { get; set; }

        [ForeignKey("VueloID")]
        public Vuelo Vuelo { get; set; }

        [ForeignKey("AsientoID")]
        public Asiento Asiento { get; set; }
    }
}
