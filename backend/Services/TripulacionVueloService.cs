using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class TripulacionVueloService : ITripulacionVueloService
    {
        private readonly ITripulacionVueloRepository _tripulacionRepository;

        public TripulacionVueloService(ITripulacionVueloRepository tripulacionRepository)
        {
            _tripulacionRepository = tripulacionRepository;
        }

        public async Task<IEnumerable<VueloTripulacion>> GetAllAsync()
        {
            return await _tripulacionRepository.GetAllAsync();
        }

        public async Task<VueloTripulacion> GetByIdAsync(int vueloId, int personalId)
        {
            return await _tripulacionRepository.GetByIdAsync(vueloId, personalId);
        }

        public async Task<VueloTripulacion> CreateAsync(CreateTripulacionVueloDto dto)
        {
            var tripulacion = new VueloTripulacion
            {
                VueloID = dto.VueloID,
                PersonalID = dto.PersonalID,
                RolAsignado = dto.RolAsignado
            };

            return await _tripulacionRepository.CreateAsync(tripulacion);
        }

        public async Task<VueloTripulacion> UpdateAsync(int vueloId, int personalId, CreateTripulacionVueloDto dto)
        {
            var tripulacion = await _tripulacionRepository.GetByIdAsync(vueloId, personalId);
            if (tripulacion == null) return null;

            tripulacion.RolAsignado = dto.RolAsignado;

            return await _tripulacionRepository.UpdateAsync(tripulacion);
        }

        public async Task<bool> DeleteAsync(int vueloId, int personalId)
        {
            return await _tripulacionRepository.DeleteAsync(vueloId, personalId);
        }
    }
}
