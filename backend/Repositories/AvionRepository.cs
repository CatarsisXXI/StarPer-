using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class AvionRepository : IAvionRepository
    {
        private readonly StarPeruContext _context;

        public AvionRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Avion>> GetAllAsync()
        {
            return await _context.Aviones.ToListAsync();
        }

        public async Task<Avion> GetByIdAsync(int id)
        {
            return await _context.Aviones.FindAsync(id);
        }

        public async Task<Avion> CreateAsync(Avion avion)
        {
            _context.Aviones.Add(avion);
            await _context.SaveChangesAsync();
            return avion;
        }

        public async Task<Avion> UpdateAsync(Avion avion)
        {
            _context.Aviones.Update(avion);
            await _context.SaveChangesAsync();
            return avion;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var avion = await _context.Aviones.FindAsync(id);
            if (avion == null) return false;

            _context.Aviones.Remove(avion);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
