using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IAsientoRepository
    {
        Task<IEnumerable<Asiento>> GetAllAsync();
        Task<Asiento> GetByIdAsync(int id);
        Task<Asiento> CreateAsync(Asiento asiento);
        Task<Asiento> UpdateAsync(Asiento asiento);
        Task<bool> DeleteAsync(int id);
    }
}
