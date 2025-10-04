using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class PersonalService : IPersonalService
    {
        private readonly IPersonalRepository _personalRepository;

        public PersonalService(IPersonalRepository personalRepository)
        {
            _personalRepository = personalRepository;
        }

        public async Task<IEnumerable<Personal>> GetAllAsync()
        {
            return await _personalRepository.GetAllAsync();
        }

        public async Task<Personal> GetByIdAsync(int id)
        {
            return await _personalRepository.GetByIdAsync(id);
        }

        public async Task<Personal> CreateAsync(CreatePersonalDto dto)
        {
            var personal = new Personal
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Puesto = dto.Puesto
            };

            return await _personalRepository.CreateAsync(personal);
        }

        public async Task<Personal> UpdateAsync(int id, CreatePersonalDto dto)
        {
            var personal = await _personalRepository.GetByIdAsync(id);
            if (personal == null) return null;

            personal.Nombre = dto.Nombre;
            personal.Apellido = dto.Apellido;
            personal.Puesto = dto.Puesto;

            return await _personalRepository.UpdateAsync(personal);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _personalRepository.DeleteAsync(id);
        }
    }
}
