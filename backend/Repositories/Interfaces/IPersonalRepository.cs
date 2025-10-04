using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IPersonalRepository
    {
        Task<IEnumerable<Personal>> GetAllAsync();
        Task<Personal> GetByIdAsync(int id);
        Task<Personal> CreateAsync(Personal personal);
        Task<Personal> UpdateAsync(Personal personal);
        Task<bool> DeleteAsync(int id);
    }
}
