using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly StarPeruContext _context;

        public AdminRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<Administrador> GetByEmailAsync(string email)
        {
            return await _context.Administradores.FirstOrDefaultAsync(a => a.Email == email);
        }

        public async Task<Administrador> CreateAsync(Administrador admin)
        {
            _context.Administradores.Add(admin);
            await _context.SaveChangesAsync();
            return admin;
        }
    }
}
