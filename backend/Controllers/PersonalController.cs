using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PersonalController : ControllerBase
    {
        private readonly IPersonalService _personalService;

        public PersonalController(IPersonalService personalService)
        {
            _personalService = personalService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var personal = await _personalService.GetAllAsync();
            return Ok(personal);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var persona = await _personalService.GetByIdAsync(id);
            if (persona == null) return NotFound();
            return Ok(persona);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePersonalDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var persona = await _personalService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = persona.PersonalID }, persona);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePersonalDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var persona = await _personalService.UpdateAsync(id, dto);
            if (persona == null) return NotFound();
            return Ok(persona);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _personalService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
