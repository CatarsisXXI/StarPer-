using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StarPeru.Api.Models
{
    public class VueloTripulacion
    {
        [Key, Column(Order = 0)]
        public int VueloID { get; set; }

        [Key, Column(Order = 1)]
        public int PersonalID { get; set; }

        [Required]
        [StringLength(50)]
        public string RolAsignado { get; set; }

        // Navigation properties
        [ForeignKey("VueloID")]
        public Vuelo Vuelo { get; set; }

        [ForeignKey("PersonalID")]
        public Personal Personal { get; set; }
    }
}
