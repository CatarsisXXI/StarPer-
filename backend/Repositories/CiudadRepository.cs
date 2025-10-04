using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class CiudadRepository : ICiudadRepository
    {
        private readonly StarPeruContext _context;

        public CiudadRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Ciudad>> GetAllAsync()
        {
            var ciudades = await _context.Ciudades.ToListAsync();
            foreach (var ciudad in ciudades)
            {
                ciudad.Nombre ??= string.Empty;
                ciudad.CodigoIATA ??= string.Empty;
            }
            return ciudades;
        }

        public async Task<Ciudad> GetByIdAsync(int id)
        {
            var ciudad = await _context.Ciudades.FindAsync(id);
            if (ciudad != null)
            {
                ciudad.Nombre ??= string.Empty;
                ciudad.CodigoIATA ??= string.Empty;
            }
            return ciudad;
        }

        public async Task<Ciudad> CreateAsync(Ciudad ciudad)
        {
            _context.Ciudades.Add(ciudad);
            await _context.SaveChangesAsync();
            return ciudad;
        }

        public async Task<Ciudad> UpdateAsync(Ciudad ciudad)
        {
            _context.Ciudades.Update(ciudad);
            await _context.SaveChangesAsync();
            return ciudad;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ciudad = await _context.Ciudades.FindAsync(id);
            if (ciudad == null) return false;

            _context.Ciudades.Remove(ciudad);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
