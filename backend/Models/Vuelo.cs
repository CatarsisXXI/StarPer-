using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StarPeru.Api.Models
{
    public class Vuelo
    {
        [Key]
        public int VueloID { get; set; }

        [Required]
        public int OrigenID { get; set; }

        [Required]
        public int DestinoID { get; set; }

        [Required]
        public int AvionID { get; set; }

        [Required]
        public DateTime FechaHoraSalida { get; set; }

        [Required]
        public DateTime FechaHoraLlegada { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        // Navigation properties
        [ForeignKey("OrigenID")]
        public Ciudad Origen { get; set; }

        [ForeignKey("DestinoID")]
        public Ciudad Destino { get; set; }

        [ForeignKey("AvionID")]
        public Avion Avion { get; set; }

        public ICollection<Asiento> Asientos { get; set; } = new List<Asiento>();
        public ICollection<VueloTripulacion> VueloTripulacion { get; set; } = new List<VueloTripulacion>();
        public ICollection<Boleto> Boletos { get; set; } = new List<Boleto>();
    }
}
