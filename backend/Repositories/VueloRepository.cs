using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class VueloRepository : IVueloRepository
    {
        private readonly StarPeruContext _context;

        public VueloRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vuelo>> GetAllAsync()
        {
            return await _context.Vuelos
                .Include(v => v.Origen)
                .Include(v => v.Destino)
                .Include(v => v.Avion)
                .ToListAsync();
        }

        public async Task<Vuelo> GetByIdAsync(int id)
        {
            return await _context.Vuelos
                .Include(v => v.Origen)
                .Include(v => v.Destino)
                .Include(v => v.Avion)
                .Include(v => v.Asientos)
                .Include(v => v.VueloTripulacion)
                    .ThenInclude(vt => vt.Personal)
                .FirstOrDefaultAsync(v => v.VueloID == id);
        }

        public async Task<Vuelo> CreateAsync(Vuelo vuelo)
        {
            _context.Vuelos.Add(vuelo);
            await _context.SaveChangesAsync();
            return vuelo;
        }

        public async Task<Vuelo> UpdateAsync(Vuelo vuelo)
        {
            _context.Vuelos.Update(vuelo);
            await _context.SaveChangesAsync();
            return vuelo;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vuelo = await _context.Vuelos.FindAsync(id);
            if (vuelo == null) return false;

            _context.Vuelos.Remove(vuelo);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Asiento>> GetAsientosByVueloIdAsync(int vueloId)
        {
            return await _context.Asientos
                .Where(a => a.VueloID == vueloId)
                .ToListAsync();
        }
    }
}
