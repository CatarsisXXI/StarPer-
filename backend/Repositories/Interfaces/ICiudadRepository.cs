using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface ICiudadRepository
    {
        Task<IEnumerable<Ciudad>> GetAllAsync();
        Task<Ciudad> GetByIdAsync(int id);
        Task<Ciudad> CreateAsync(Ciudad ciudad);
        Task<Ciudad> UpdateAsync(Ciudad ciudad);
        Task<bool> DeleteAsync(int id);
    }
}
