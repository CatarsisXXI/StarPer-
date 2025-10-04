using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class AsientoService : IAsientoService
    {
        private readonly IAsientoRepository _asientoRepository;

        public AsientoService(IAsientoRepository asientoRepository)
        {
            _asientoRepository = asientoRepository;
        }

        public async Task<IEnumerable<Asiento>> GetAllAsync()
        {
            return await _asientoRepository.GetAllAsync();
        }

        public async Task<Asiento> GetByIdAsync(int id)
        {
            return await _asientoRepository.GetByIdAsync(id);
        }

        public async Task<Asiento> CreateAsync(CreateAsientoDto dto)
        {
            var asiento = new Asiento
            {
                VueloID = dto.VueloID,
                NumeroAsiento = dto.NumeroAsiento,
                Disponible = dto.Disponible
            };

            return await _asientoRepository.CreateAsync(asiento);
        }

        public async Task<Asiento> UpdateAsync(int id, CreateAsientoDto dto)
        {
            var asiento = await _asientoRepository.GetByIdAsync(id);
            if (asiento == null) return null;

            asiento.VueloID = dto.VueloID;
            asiento.NumeroAsiento = dto.NumeroAsiento;
            asiento.Disponible = dto.Disponible;

            return await _asientoRepository.UpdateAsync(asiento);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _asientoRepository.DeleteAsync(id);
        }
    }
}
