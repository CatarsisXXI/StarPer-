using StarPeru.Api.DTOs;
using StarPeru.Api.Models;

namespace StarPeru.Api.Services.Interfaces
{
    public interface ICiudadService
    {
        Task<IEnumerable<Ciudad>> GetAllAsync();
        Task<Ciudad> GetByIdAsync(int id);
        Task<Ciudad> CreateAsync(CreateCiudadDto dto);
        Task<Ciudad> UpdateAsync(int id, CreateCiudadDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
