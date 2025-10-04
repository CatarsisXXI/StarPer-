using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class PasajeroRepository : IPasajeroRepository
    {
        private readonly StarPeruContext _context;

        public PasajeroRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pasajero>> GetAllAsync()
        {
            return await _context.Pasajeros.ToListAsync();
        }

        public async Task<Pasajero> GetByIdAsync(int id)
        {
            return await _context.Pasajeros.FindAsync(id);
        }

        public async Task<Pasajero> GetByEmailAsync(string email)
        {
            return await _context.Pasajeros.FirstOrDefaultAsync(p => p.Email == email);
        }

        public async Task<Pasajero> CreateAsync(Pasajero pasajero)
        {
            _context.Pasajeros.Add(pasajero);
            await _context.SaveChangesAsync();
            return pasajero;
        }

        public async Task<Pasajero> UpdateAsync(Pasajero pasajero)
        {
            _context.Pasajeros.Update(pasajero);
            await _context.SaveChangesAsync();
            return pasajero;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var pasajero = await _context.Pasajeros.FindAsync(id);
            if (pasajero == null) return false;

            _context.Pasajeros.Remove(pasajero);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
