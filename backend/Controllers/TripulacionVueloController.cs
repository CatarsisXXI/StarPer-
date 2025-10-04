using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/tripulacion-vuelo")]
    [Authorize]
    public class TripulacionVueloController : ControllerBase
    {
        private readonly ITripulacionVueloService _tripulacionService;

        public TripulacionVueloController(ITripulacionVueloService tripulacionService)
        {
            _tripulacionService = tripulacionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tripulaciones = await _tripulacionService.GetAllAsync();
            return Ok(tripulaciones);
        }

        [HttpGet("{vueloId}/{personalId}")]
        public async Task<IActionResult> GetById(int vueloId, int personalId)
        {
            var tripulacion = await _tripulacionService.GetByIdAsync(vueloId, personalId);
            if (tripulacion == null) return NotFound();
            return Ok(tripulacion);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTripulacionVueloDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var tripulacion = await _tripulacionService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { vueloId = tripulacion.VueloID, personalId = tripulacion.PersonalID },
                tripulacion);
        }

        [HttpPut("{vueloId}/{personalId}")]
        public async Task<IActionResult> Update(int vueloId, int personalId, [FromBody] CreateTripulacionVueloDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var tripulacion = await _tripulacionService.UpdateAsync(vueloId, personalId, dto);
            if (tripulacion == null) return NotFound();
            return Ok(tripulacion);
        }

        [HttpDelete("{vueloId}/{personalId}")]
        public async Task<IActionResult> Delete(int vueloId, int personalId)
        {
            var result = await _tripulacionService.DeleteAsync(vueloId, personalId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
