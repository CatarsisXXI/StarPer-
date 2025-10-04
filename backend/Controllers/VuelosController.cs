using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VuelosController : ControllerBase
    {
        private readonly IVueloService _vueloService;

        public VuelosController(IVueloService vueloService)
        {
            _vueloService = vueloService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var vuelos = await _vueloService.GetAllAsync();
            return Ok(vuelos);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var vuelo = await _vueloService.GetByIdAsync(id);
            if (vuelo == null) return NotFound();
            return Ok(vuelo);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVueloDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var vuelo = await _vueloService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = vuelo.VueloID }, vuelo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateVueloDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var vuelo = await _vueloService.UpdateAsync(id, dto);
            if (vuelo == null) return NotFound();
            return Ok(vuelo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _vueloService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("{id}/asientos")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAsientos(int id)
        {
            var asientos = await _vueloService.GetAsientosByVueloIdAsync(id);
            return Ok(asientos);
        }

        [HttpPost("{id}/tripulacion")]
        public async Task<IActionResult> AsignarTripulacion(int id, [FromBody] CreateTripulacionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var result = await _vueloService.AsignarTripulacionAsync(id, dto);
                if (!result) return NotFound();
                return Ok("Tripulación asignada correctamente");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
