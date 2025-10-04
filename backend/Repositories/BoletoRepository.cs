using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class BoletoRepository : IBoletoRepository
    {
        private readonly StarPeruContext _context;

        public BoletoRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Boleto>> GetAllAsync()
        {
            return await _context.Boletos
                .Include(b => b.Pasajero)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Origen)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Destino)
                .Include(b => b.Asiento)
                .ToListAsync();
        }

        public async Task<Boleto> GetByIdAsync(int id)
        {
            return await _context.Boletos
                .Include(b => b.Pasajero)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Origen)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Destino)
                .Include(b => b.Asiento)
                .FirstOrDefaultAsync(b => b.BoletoID == id);
        }

        public async Task<Boleto> CreateAsync(Boleto boleto)
        {
            _context.Boletos.Add(boleto);
            await _context.SaveChangesAsync();
            return boleto;
        }

        public async Task<Boleto> UpdateAsync(Boleto boleto)
        {
            _context.Boletos.Update(boleto);
            await _context.SaveChangesAsync();
            return boleto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var boleto = await _context.Boletos.FindAsync(id);
            if (boleto == null) return false;

            _context.Boletos.Remove(boleto);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Boleto>> GetByPasajeroIdAsync(int pasajeroId)
        {
            return await _context.Boletos
                .Where(b => b.PasajeroID == pasajeroId)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Origen)
                .Include(b => b.Vuelo)
                    .ThenInclude(v => v.Destino)
                .Include(b => b.Asiento)
                .ToListAsync();
        }
    }
}
