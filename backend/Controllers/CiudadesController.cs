using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CiudadesController : ControllerBase
    {
        private readonly ICiudadService _ciudadService;

        public CiudadesController(ICiudadService ciudadService)
        {
            _ciudadService = ciudadService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ciudades = await _ciudadService.GetAllAsync();
                return Ok(ciudades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var ciudad = await _ciudadService.GetByIdAsync(id);
            if (ciudad == null) return NotFound();
            return Ok(ciudad);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCiudadDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var ciudad = await _ciudadService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = ciudad.CiudadID }, ciudad);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateCiudadDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var ciudad = await _ciudadService.UpdateAsync(id, dto);
            if (ciudad == null) return NotFound();
            return Ok(ciudad);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _ciudadService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
