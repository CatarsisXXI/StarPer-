using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AsientosController : ControllerBase
    {
        private readonly IAsientoService _asientoService;

        public AsientosController(IAsientoService asientoService)
        {
            _asientoService = asientoService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var asientos = await _asientoService.GetAllAsync();
            return Ok(asientos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var asiento = await _asientoService.GetByIdAsync(id);
            if (asiento == null) return NotFound();
            return Ok(asiento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAsientoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var asiento = await _asientoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = asiento.AsientoID }, asiento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateAsientoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var asiento = await _asientoService.UpdateAsync(id, dto);
            if (asiento == null) return NotFound();
            return Ok(asiento);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _asientoService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
