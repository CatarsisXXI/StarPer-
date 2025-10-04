using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class VueloService : IVueloService
    {
        private readonly IVueloRepository _vueloRepository;
        private readonly IAvionRepository _avionRepository;
        private readonly ICiudadRepository _ciudadRepository;
        private readonly IPersonalRepository _personalRepository;

        public VueloService(
            IVueloRepository vueloRepository,
            IAvionRepository avionRepository,
            ICiudadRepository ciudadRepository,
            IPersonalRepository personalRepository)
        {
            _vueloRepository = vueloRepository;
            _avionRepository = avionRepository;
            _ciudadRepository = ciudadRepository;
            _personalRepository = personalRepository;
        }

        public async Task<IEnumerable<Vuelo>> GetAllAsync()
        {
            return await _vueloRepository.GetAllAsync();
        }

        public async Task<Vuelo> GetByIdAsync(int id)
        {
            return await _vueloRepository.GetByIdAsync(id);
        }

        public async Task<Vuelo> CreateAsync(CreateVueloDto dto)
        {
            // Validar que el avión existe
            var avion = await _avionRepository.GetByIdAsync(dto.AvionID);
            if (avion == null) throw new ArgumentException("Avión no encontrado");

            // Validar que las ciudades existen
            var origen = await _ciudadRepository.GetByIdAsync(dto.OrigenID);
            if (origen == null) throw new ArgumentException("Ciudad de origen no encontrada");

            var destino = await _ciudadRepository.GetByIdAsync(dto.DestinoID);
            if (destino == null) throw new ArgumentException("Ciudad de destino no encontrada");

            var vuelo = new Vuelo
            {
                AvionID = dto.AvionID,
                OrigenID = dto.OrigenID,
                DestinoID = dto.DestinoID,
                FechaHoraSalida = dto.FechaHoraSalida,
                FechaHoraLlegada = dto.FechaHoraLlegada,
                Precio = dto.Precio
            };

            return await _vueloRepository.CreateAsync(vuelo);
        }

        public async Task<Vuelo> UpdateAsync(int id, CreateVueloDto dto)
        {
            var vuelo = await _vueloRepository.GetByIdAsync(id);
            if (vuelo == null) return null;

            vuelo.AvionID = dto.AvionID;
            vuelo.OrigenID = dto.OrigenID;
            vuelo.DestinoID = dto.DestinoID;
            vuelo.FechaHoraSalida = dto.FechaHoraSalida;
            vuelo.FechaHoraLlegada = dto.FechaHoraLlegada;
            vuelo.Precio = dto.Precio;

            return await _vueloRepository.UpdateAsync(vuelo);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _vueloRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Asiento>> GetAsientosByVueloIdAsync(int vueloId)
        {
            return await _vueloRepository.GetAsientosByVueloIdAsync(vueloId);
        }

        public async Task<bool> AsignarTripulacionAsync(int vueloId, CreateTripulacionDto dto)
        {
            var vuelo = await _vueloRepository.GetByIdAsync(vueloId);
            if (vuelo == null) return false;

            // Validar que el personal existe
            var personal = await _personalRepository.GetByIdAsync(dto.PersonalID);
            if (personal == null) throw new ArgumentException($"Personal con ID {dto.PersonalID} no encontrado");

            // Aquí se debería implementar la lógica para asignar tripulación
            // Por simplicidad, asumimos que se asigna correctamente
            return true;
        }
    }
}
