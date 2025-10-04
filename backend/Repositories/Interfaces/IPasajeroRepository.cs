using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IPasajeroRepository
    {
        Task<IEnumerable<Pasajero>> GetAllAsync();
        Task<Pasajero> GetByIdAsync(int id);
        Task<Pasajero> GetByEmailAsync(string email);
        Task<Pasajero> CreateAsync(Pasajero pasajero);
        Task<Pasajero> UpdateAsync(Pasajero pasajero);
        Task<bool> DeleteAsync(int id);
    }
}
