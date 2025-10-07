using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalController : ControllerBase
    {
        private readonly IPersonalService _personalService;
        private readonly IAvionService _avionService;

        public PersonalController(IPersonalService personalService, IAvionService avionService)
        {
            _personalService = personalService;
            _avionService = avionService;
        }

        // ✅ Obtener todo el personal
        [HttpGet]
        [AllowAnonymous] // Para desarrollo
        public async Task<IActionResult> GetAll()
        {
            var personal = await _personalService.GetAllAsync();
            return Ok(personal);
        }

        // ✅ Obtener personal disponible por puesto
        [HttpGet("available")]
        [AllowAnonymous] // Para desarrollo
        public async Task<IActionResult> GetAvailableByPuesto([FromQuery] string puesto)
        {
            if (string.IsNullOrWhiteSpace(puesto))
                return BadRequest("El parámetro 'puesto' es obligatorio.");

            var personal = await _personalService.GetAvailableByPuestoAsync(puesto);
            if (personal == null || !personal.Any())
                return Ok(new List<object>()); // Retorna array vacío si no hay resultados

            return Ok(personal);
        }

        // ✅ Crear nuevo personal
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePersonalDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var persona = await _personalService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = persona.PersonalID }, persona);
        }

        // ✅ Actualizar personal
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePersonalDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var persona = await _personalService.UpdateAsync(id, dto);
            if (persona == null) return NotFound();
            return Ok(persona);
        }

        // ✅ Eliminar personal
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _personalService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        // ✅ Endpoint opcional para listar aviones
        [HttpGet("aviones")]
        [AllowAnonymous] // Para desarrollo
        public async Task<IActionResult> GetAviones()
        {
            var aviones = await _avionService.GetAllAsync();
            return Ok(aviones);
        }
    }
}
