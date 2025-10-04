using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IVueloRepository
    {
        Task<IEnumerable<Vuelo>> GetAllAsync();
        Task<Vuelo> GetByIdAsync(int id);
        Task<Vuelo> CreateAsync(Vuelo vuelo);
        Task<Vuelo> UpdateAsync(Vuelo vuelo);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Asiento>> GetAsientosByVueloIdAsync(int vueloId);
    }
}
