using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StarPeru.Api.DTOs;
using StarPeru.Api.Models;
using StarPeru.Api.Repositories.Interfaces;
using StarPeru.Api.Services.Interfaces;

namespace StarPeru.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IPasajeroRepository _pasajeroRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IPasajeroRepository pasajeroRepository, IAdminRepository adminRepository, IConfiguration configuration)
        {
            _pasajeroRepository = pasajeroRepository;
            _adminRepository = adminRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            // First check if user is admin
            var admin = await _adminRepository.GetByEmailAsync(loginDto.Email);
            if (admin != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.PasswordHash))
            {
                var token = GenerateJwtToken(admin.Email, "Admin");
                var userDto = new UserDto
                {
                    Email = admin.Email,
                    Role = "Admin",
                    Nombre = admin.Nombre,
                    Apellido = admin.Apellido,
                    PasajeroID = null
                };
                return new LoginResponseDto { Token = token, User = userDto, Success = true };
            }

            // Check if user is passenger
             var pasajero = await _pasajeroRepository.GetByEmailAsync(loginDto.Email);
             if (pasajero != null && pasajero.PasswordHash != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, pasajero.PasswordHash))
             {
                 var token = GenerateJwtToken(pasajero.Email, "Pasajero");
                var userDto = new UserDto
                {
                    Email = pasajero.Email,
                    Role = "Pasajero",
                    Nombre = pasajero.Nombre,
                    Apellido = pasajero.Apellido,
                    PasajeroID = pasajero.PasajeroID
                };
                return new LoginResponseDto { Token = token, User = userDto, Success = true };
             }

             throw new UnauthorizedAccessException("Invalid credentials");
         }

        public async Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _pasajeroRepository.GetByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new ArgumentException("Email already registered");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var pasajero = new Pasajero
            {
                Nombre = registerDto.Nombre,
                Apellido = registerDto.Apellido,
                Email = registerDto.Email,
                Telefono = registerDto.Telefono,
                PasswordHash = hashedPassword
            };

            await _pasajeroRepository.CreateAsync(pasajero);

            // Generate token for immediate login after registration
            var token = GenerateJwtToken(pasajero.Email, "Pasajero");
            var userDto = new UserDto
            {
                Email = pasajero.Email,
                Role = "Pasajero",
                Nombre = pasajero.Nombre,
                Apellido = pasajero.Apellido,
                PasajeroID = pasajero.PasajeroID
            };

            return new LoginResponseDto { Token = token, User = userDto, Success = true, Message = "Registration successful" };
        }

        private string GenerateJwtToken(string email, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
