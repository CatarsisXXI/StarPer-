using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IAsientoService
    {
        Task<IEnumerable<Asiento>> GetAllAsync();
        Task<Asiento> GetByIdAsync(int id);
        Task<Asiento> CreateAsync(CreateAsientoDto dto);
        Task<Asiento> UpdateAsync(int id, CreateAsientoDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
