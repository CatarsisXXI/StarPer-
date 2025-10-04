using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IVueloService
    {
        Task<IEnumerable<Vuelo>> GetAllAsync();
        Task<Vuelo> GetByIdAsync(int id);
        Task<Vuelo> CreateAsync(CreateVueloDto dto);
        Task<Vuelo> UpdateAsync(int id, CreateVueloDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Asiento>> GetAsientosByVueloIdAsync(int vueloId);
        Task<bool> AsignarTripulacionAsync(int vueloId, CreateTripulacionDto dto);
    }
}
