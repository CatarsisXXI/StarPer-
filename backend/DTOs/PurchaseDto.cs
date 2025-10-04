using System.ComponentModel.DataAnnotations;

namespace StarPeru.Api.DTOs
{
    public class PurchaseDto
    {
        [Required]
        public int PasajeroID { get; set; }

        [Required]
        public int VueloID { get; set; }

        [Required]
        public int AsientoID { get; set; }

        [Required]
        [Range(0.01, 10000)]
        public decimal Precio { get; set; }
    }
}
