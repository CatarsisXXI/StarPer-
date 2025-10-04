using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BoletoController : ControllerBase
    {
        private readonly IBoletoService _boletoService;

        public BoletoController(IBoletoService boletoService)
        {
            _boletoService = boletoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var boletos = await _boletoService.GetAllAsync();
            return Ok(boletos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var boleto = await _boletoService.GetByIdAsync(id);
            if (boleto == null) return NotFound();
            return Ok(boleto);
        }

        [HttpPost("comprar")]
        [AllowAnonymous]
        public async Task<IActionResult> Comprar([FromBody] PurchaseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var boleto = await _boletoService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = boleto.BoletoID }, boleto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Boleto boleto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedBoleto = await _boletoService.UpdateAsync(id, boleto);
            if (updatedBoleto == null) return NotFound();
            return Ok(updatedBoleto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _boletoService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("pasajero/{pasajeroId}")]
        public async Task<IActionResult> GetByPasajeroId(int pasajeroId)
        {
            var boletos = await _boletoService.GetByPasajeroIdAsync(pasajeroId);
            return Ok(boletos);
        }
    }
}
