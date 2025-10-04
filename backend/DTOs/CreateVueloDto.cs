using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class CreateVueloDto
    {
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
        [Range(0.01, 10000)]
        public decimal Precio { get; set; }
    }
}
