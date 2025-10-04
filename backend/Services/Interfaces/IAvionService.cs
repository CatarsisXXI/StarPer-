using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IAvionService
    {
        Task<IEnumerable<Avion>> GetAllAsync();
        Task<Avion> GetByIdAsync(int id);
        Task<Avion> CreateAsync(CreateAvionDto dto);
        Task<Avion> UpdateAsync(int id, CreateAvionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
