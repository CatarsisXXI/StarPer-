using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AvionesController : ControllerBase
    {
        private readonly IAvionService _avionService;

        public AvionesController(IAvionService avionService)
        {
            _avionService = avionService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var aviones = await _avionService.GetAllAsync();
            return Ok(aviones);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var avion = await _avionService.GetByIdAsync(id);
            if (avion == null) return NotFound();
            return Ok(avion);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAvionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var avion = await _avionService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = avion.AvionID }, avion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateAvionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var avion = await _avionService.UpdateAsync(id, dto);
            if (avion == null) return NotFound();
            return Ok(avion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _avionService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
