namespace StarPeru.Api.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class UserDto
    {
        public string Email { get; set; }
        public string Role { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int? PasajeroID { get; set; }
    }
}
