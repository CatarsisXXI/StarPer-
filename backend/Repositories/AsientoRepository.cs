using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class AsientoRepository : IAsientoRepository
    {
        private readonly StarPeruContext _context;

        public AsientoRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Asiento>> GetAllAsync()
        {
            return await _context.Asientos
                .Include(a => a.Vuelo)
                .ToListAsync();
        }

        public async Task<Asiento> GetByIdAsync(int id)
        {
            return await _context.Asientos
                .Include(a => a.Vuelo)
                .FirstOrDefaultAsync(a => a.AsientoID == id);
        }

        public async Task<Asiento> CreateAsync(Asiento asiento)
        {
            _context.Asientos.Add(asiento);
            await _context.SaveChangesAsync();
            return asiento;
        }

        public async Task<Asiento> UpdateAsync(Asiento asiento)
        {
            _context.Asientos.Update(asiento);
            await _context.SaveChangesAsync();
            return asiento;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var asiento = await _context.Asientos.FindAsync(id);
            if (asiento == null) return false;

            _context.Asientos.Remove(asiento);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
