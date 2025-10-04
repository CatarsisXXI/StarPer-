using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class TripulacionVueloRepository : ITripulacionVueloRepository
    {
        private readonly StarPeruContext _context;

        public TripulacionVueloRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VueloTripulacion>> GetAllAsync()
        {
            return await _context.VueloTripulacion
                .Include(vt => vt.Vuelo)
                .Include(vt => vt.Personal)
                .ToListAsync();
        }

        public async Task<VueloTripulacion> GetByIdAsync(int vueloId, int personalId)
        {
            return await _context.VueloTripulacion
                .Include(vt => vt.Vuelo)
                .Include(vt => vt.Personal)
                .FirstOrDefaultAsync(vt => vt.VueloID == vueloId && vt.PersonalID == personalId);
        }

        public async Task<VueloTripulacion> CreateAsync(VueloTripulacion tripulacion)
        {
            _context.VueloTripulacion.Add(tripulacion);
            await _context.SaveChangesAsync();
            return tripulacion;
        }

        public async Task<VueloTripulacion> UpdateAsync(VueloTripulacion tripulacion)
        {
            _context.VueloTripulacion.Update(tripulacion);
            await _context.SaveChangesAsync();
            return tripulacion;
        }

        public async Task<bool> DeleteAsync(int vueloId, int personalId)
        {
            var tripulacion = await _context.VueloTripulacion.FindAsync(vueloId, personalId);
            if (tripulacion == null) return false;

            _context.VueloTripulacion.Remove(tripulacion);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
