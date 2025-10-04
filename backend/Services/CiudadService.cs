using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class CiudadService : ICiudadService
    {
        private readonly ICiudadRepository _ciudadRepository;

        public CiudadService(ICiudadRepository ciudadRepository)
        {
            _ciudadRepository = ciudadRepository;
        }

        public async Task<IEnumerable<Ciudad>> GetAllAsync()
        {
            return await _ciudadRepository.GetAllAsync();
        }

        public async Task<Ciudad> GetByIdAsync(int id)
        {
            return await _ciudadRepository.GetByIdAsync(id);
        }

        public async Task<Ciudad> CreateAsync(CreateCiudadDto dto)
        {
            var ciudad = new Ciudad
            {
                Nombre = dto.Nombre,
                CodigoIATA = dto.CodigoIATA,
                DuracionEstimadahoras = dto.DuracionEstimadahoras
            };

            return await _ciudadRepository.CreateAsync(ciudad);
        }

        public async Task<Ciudad> UpdateAsync(int id, CreateCiudadDto dto)
        {
            var ciudad = await _ciudadRepository.GetByIdAsync(id);
            if (ciudad == null) return null;

            ciudad.Nombre = dto.Nombre;
            ciudad.CodigoIATA = dto.CodigoIATA;
            ciudad.DuracionEstimadahoras = dto.DuracionEstimadahoras;

            return await _ciudadRepository.UpdateAsync(ciudad);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _ciudadRepository.DeleteAsync(id);
        }
    }
}
