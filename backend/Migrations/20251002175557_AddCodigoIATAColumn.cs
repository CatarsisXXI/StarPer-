using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarPeru.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCodigoIATAColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Pasajeros",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Ciudades",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "CodigoIATA",
                table: "Ciudades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 1,
                column: "CodigoIATA",
                value: "LIM");

            migrationBuilder.UpdateData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 2,
                column: "CodigoIATA",
                value: "CUZ");

            migrationBuilder.UpdateData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 3,
                column: "CodigoIATA",
                value: "AQP");

            migrationBuilder.UpdateData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 4,
                column: "CodigoIATA",
                value: "PIU");

            migrationBuilder.UpdateData(
                table: "Ciudades",
                keyColumn: "CiudadID",
                keyValue: 5,
                column: "CodigoIATA",
                value: "IQT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Pasajeros");

            migrationBuilder.DropColumn(
                name: "CodigoIATA",
                table: "Ciudades");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Ciudades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
