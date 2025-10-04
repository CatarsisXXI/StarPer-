using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IBoletoService
    {
        Task<IEnumerable<Boleto>> GetAllAsync();
        Task<Boleto> GetByIdAsync(int id);
        Task<Boleto> CreateAsync(PurchaseDto dto);
        Task<Boleto> UpdateAsync(int id, Boleto boleto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Boleto>> GetByPasajeroIdAsync(int pasajeroId);
    }
}
