using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class AvionService : IAvionService
    {
        private readonly IAvionRepository _avionRepository;

        public AvionService(IAvionRepository avionRepository)
        {
            _avionRepository = avionRepository;
        }

        public async Task<IEnumerable<Avion>> GetAllAsync()
        {
            return await _avionRepository.GetAllAsync();
        }

        public async Task<Avion> GetByIdAsync(int id)
        {
            return await _avionRepository.GetByIdAsync(id);
        }

        public async Task<Avion> CreateAsync(CreateAvionDto dto)
        {
            var avion = new Avion
            {
                Modelo = dto.Modelo,
                Capacidad = dto.Capacidad
            };

            return await _avionRepository.CreateAsync(avion);
        }

        public async Task<Avion> UpdateAsync(int id, CreateAvionDto dto)
        {
            var avion = await _avionRepository.GetByIdAsync(id);
            if (avion == null) return null;

            avion.Modelo = dto.Modelo;
            avion.Capacidad = dto.Capacidad;

            return await _avionRepository.UpdateAsync(avion);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _avionRepository.DeleteAsync(id);
        }
    }
}
