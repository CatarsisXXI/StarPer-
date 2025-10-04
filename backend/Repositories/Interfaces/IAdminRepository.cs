using StarPeru.Api.Models;

namespace StarPeru.Api.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<Administrador> GetByEmailAsync(string email);
        Task<Administrador> CreateAsync(Administrador admin);
    }
}
