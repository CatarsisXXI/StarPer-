using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Data;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;

namespace StarPeru.Api.Repositories
{
    public class PersonalRepository : IPersonalRepository
    {
        private readonly StarPeruContext _context;

        public PersonalRepository(StarPeruContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Personal>> GetAllAsync()
        {
            return await _context.Personal.ToListAsync();
        }

        public async Task<Personal> GetByIdAsync(int id)
        {
            return await _context.Personal.FindAsync(id);
        }

        public async Task<Personal> CreateAsync(Personal personal)
        {
            _context.Personal.Add(personal);
            await _context.SaveChangesAsync();
            return personal;
        }

        public async Task<Personal> UpdateAsync(Personal personal)
        {
            _context.Personal.Update(personal);
            await _context.SaveChangesAsync();
            return personal;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var personal = await _context.Personal.FindAsync(id);
            if (personal == null) return false;

            _context.Personal.Remove(personal);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
