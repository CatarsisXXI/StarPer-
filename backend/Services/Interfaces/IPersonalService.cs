using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IPersonalService
    {
        Task<IEnumerable<Personal>> GetAllAsync();
        Task<Personal> GetByIdAsync(int id);
        Task<Personal> CreateAsync(CreatePersonalDto dto);
        Task<Personal> UpdateAsync(int id, CreatePersonalDto dto);
        Task<bool> DeleteAsync(int id);

        Task<IEnumerable<Personal>> GetAvailableByPuestoAsync(string puesto);
    }
}
