using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class BoletoService : IBoletoService
    {
        private readonly IBoletoRepository _boletoRepository;
        private readonly IVueloRepository _vueloRepository;
        private readonly IPasajeroRepository _pasajeroRepository;
        private readonly IAsientoRepository _asientoRepository;

        public BoletoService(
            IBoletoRepository boletoRepository,
            IVueloRepository vueloRepository,
            IPasajeroRepository pasajeroRepository,
            IAsientoRepository asientoRepository)
        {
            _boletoRepository = boletoRepository;
            _vueloRepository = vueloRepository;
            _pasajeroRepository = pasajeroRepository;
            _asientoRepository = asientoRepository;
        }

        public async Task<IEnumerable<Boleto>> GetAllAsync()
        {
            return await _boletoRepository.GetAllAsync();
        }

        public async Task<Boleto> GetByIdAsync(int id)
        {
            return await _boletoRepository.GetByIdAsync(id);
        }

        public async Task<Boleto> CreateAsync(PurchaseDto dto)
        {
            // Validar que el vuelo existe
            var vuelo = await _vueloRepository.GetByIdAsync(dto.VueloID);
            if (vuelo == null) throw new ArgumentException("Vuelo no encontrado");

            // Validar que el pasajero existe
            var pasajero = await _pasajeroRepository.GetByIdAsync(dto.PasajeroID);
            if (pasajero == null) throw new ArgumentException("Pasajero no encontrado");

            // Validar que el asiento existe y está disponible
            var asiento = await _asientoRepository.GetByIdAsync(dto.AsientoID);
            if (asiento == null) throw new ArgumentException("Asiento no encontrado");
            if (!asiento.Disponible) throw new ArgumentException("Asiento no disponible");

            // Aquí se debería implementar la lógica de precios, disponibilidad de asientos, etc.
            // Por simplicidad, creamos el boleto directamente

            var boleto = new Boleto
            {
                VueloID = dto.VueloID,
                PasajeroID = dto.PasajeroID,
                AsientoID = dto.AsientoID,
                Precio = dto.Precio,
                FechaCompra = DateTime.Now
            };

            // Marcar el asiento como ocupado después de crear el boleto
            asiento.Disponible = false;
            await _asientoRepository.UpdateAsync(asiento);

            return await _boletoRepository.CreateAsync(boleto);
        }

        public async Task<Boleto> UpdateAsync(int id, Boleto boleto)
        {
            var existingBoleto = await _boletoRepository.GetByIdAsync(id);
            if (existingBoleto == null) return null;

            boleto.BoletoID = id;
            return await _boletoRepository.UpdateAsync(boleto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _boletoRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Boleto>> GetByPasajeroIdAsync(int pasajeroId)
        {
            return await _boletoRepository.GetByPasajeroIdAsync(pasajeroId);
        }
    }
}
