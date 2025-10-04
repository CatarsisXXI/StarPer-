using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface ITripulacionVueloRepository
    {
        Task<IEnumerable<VueloTripulacion>> GetAllAsync();
        Task<VueloTripulacion> GetByIdAsync(int vueloId, int personalId);
        Task<VueloTripulacion> CreateAsync(VueloTripulacion tripulacion);
        Task<VueloTripulacion> UpdateAsync(VueloTripulacion tripulacion);
        Task<bool> DeleteAsync(int vueloId, int personalId);
    }
}
