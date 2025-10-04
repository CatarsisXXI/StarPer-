using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface ITripulacionVueloService
    {
        Task<IEnumerable<VueloTripulacion>> GetAllAsync();
        Task<VueloTripulacion> GetByIdAsync(int vueloId, int personalId);
        Task<VueloTripulacion> CreateAsync(CreateTripulacionVueloDto dto);
        Task<VueloTripulacion> UpdateAsync(int vueloId, int personalId, CreateTripulacionVueloDto dto);
        Task<bool> DeleteAsync(int vueloId, int personalId);
    }
}
