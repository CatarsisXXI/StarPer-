using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StarPeru.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSeatGenerationForExistingFlights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Administradores",
                keyColumn: "AdminID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Aviones",
                keyColumn: "AvionID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Aviones",
                keyColumn: "AvionID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Personal",
                keyColumn: "PersonalID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Personal",
                keyColumn: "PersonalID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Personal",
                keyColumn: "PersonalID",
                keyValue: 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Administradores",
                columns: new[] { "AdminID", "Apellido", "Email", "Nombre", "PasswordHash", "Rol" },
                values: new object[] { 1, "Principal", "admin@starperu.com", "Admin", "$2b$12$WPWaeP7tm1amuykoVAafq.xaAdL1lCOsdF30463ce2Hj.fa/WVVFG", "Administrador" });

            migrationBuilder.InsertData(
                table: "Aviones",
                columns: new[] { "AvionID", "Capacidad", "Modelo" },
                values: new object[,]
                {
                    { 1, 150, "Airbus A320" },
                    { 2, 180, "Boeing 737" }
                });

            migrationBuilder.InsertData(
                table: "Ciudades",
                columns: new[] { "CiudadID", "CodigoIATA", "DuracionEstimadahoras", "Nombre" },
                values: new object[,]
                {
                    { 1, "LIM", 0, "Lima" },
                    { 2, "CUZ", 1, "Cusco" },
                    { 3, "AQP", 1, "Arequipa" },
                    { 4, "PIU", 2, "Piura" },
                    { 5, "IQT", 2, "Iquitos" }
                });

            migrationBuilder.InsertData(
                table: "Personal",
                columns: new[] { "PersonalID", "Apellido", "Nombre", "Puesto" },
                values: new object[,]
                {
                    { 1, "Perez", "Juan", "Piloto" },
                    { 2, "Lopez", "Maria", "Copiloto" },
                    { 3, "Ramirez", "Ana", "Azafata" }
                });
        }
    }
}
