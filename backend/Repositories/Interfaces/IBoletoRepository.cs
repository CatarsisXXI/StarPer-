using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IBoletoRepository
    {
        Task<IEnumerable<Boleto>> GetAllAsync();
        Task<Boleto> GetByIdAsync(int id);
        Task<Boleto> CreateAsync(Boleto boleto);
        Task<Boleto> UpdateAsync(Boleto boleto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Boleto>> GetByPasajeroIdAsync(int pasajeroId);
    }
}
