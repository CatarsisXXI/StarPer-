using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IAvionRepository
    {
        Task<IEnumerable<Avion>> GetAllAsync();
        Task<Avion> GetByIdAsync(int id);
        Task<Avion> CreateAsync(Avion avion);
        Task<Avion> UpdateAsync(Avion avion);
        Task<bool> DeleteAsync(int id);
    }
}
