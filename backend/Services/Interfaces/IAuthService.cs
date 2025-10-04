using StarPeru.Api.DTOs;

namespace StarPeru.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto);
    }
}
