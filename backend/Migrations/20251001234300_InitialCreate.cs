using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StarPeru.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Administradores",
                columns: table => new
                {
                    AdminID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administradores", x => x.AdminID);
                });

            migrationBuilder.CreateTable(
                name: "Aviones",
                columns: table => new
                {
                    AvionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Modelo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Capacidad = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aviones", x => x.AvionID);
                });

            migrationBuilder.CreateTable(
                name: "Ciudades",
                columns: table => new
                {
                    CiudadID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DuracionEstimadahoras = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ciudades", x => x.CiudadID);
                });

            migrationBuilder.CreateTable(
                name: "Pasajeros",
                columns: table => new
                {
                    PasajeroID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pasajeros", x => x.PasajeroID);
                });

            migrationBuilder.CreateTable(
                name: "Personal",
                columns: table => new
                {
                    PersonalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Puesto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personal", x => x.PersonalID);
                });

            migrationBuilder.CreateTable(
                name: "Vuelos",
                columns: table => new
                {
                    VueloID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrigenID = table.Column<int>(type: "int", nullable: false),
                    DestinoID = table.Column<int>(type: "int", nullable: false),
                    AvionID = table.Column<int>(type: "int", nullable: false),
                    FechaHoraSalida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaHoraLlegada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vuelos", x => x.VueloID);
                    table.ForeignKey(
                        name: "FK_Vuelos_Aviones_AvionID",
                        column: x => x.AvionID,
                        principalTable: "Aviones",
                        principalColumn: "AvionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vuelos_Ciudades_DestinoID",
                        column: x => x.DestinoID,
                        principalTable: "Ciudades",
                        principalColumn: "CiudadID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vuelos_Ciudades_OrigenID",
                        column: x => x.OrigenID,
                        principalTable: "Ciudades",
                        principalColumn: "CiudadID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Asientos",
                columns: table => new
                {
                    AsientoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VueloID = table.Column<int>(type: "int", nullable: false),
                    NumeroAsiento = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Disponible = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asientos", x => x.AsientoID);
                    table.ForeignKey(
                        name: "FK_Asientos_Vuelos_VueloID",
                        column: x => x.VueloID,
                        principalTable: "Vuelos",
                        principalColumn: "VueloID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VueloTripulacion",
                columns: table => new
                {
                    VueloID = table.Column<int>(type: "int", nullable: false),
                    PersonalID = table.Column<int>(type: "int", nullable: false),
                    RolAsignado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VueloTripulacion", x => new { x.VueloID, x.PersonalID });
                    table.ForeignKey(
                        name: "FK_VueloTripulacion_Personal_PersonalID",
                        column: x => x.PersonalID,
                        principalTable: "Personal",
                        principalColumn: "PersonalID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VueloTripulacion_Vuelos_VueloID",
                        column: x => x.VueloID,
                        principalTable: "Vuelos",
                        principalColumn: "VueloID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Boletos",
                columns: table => new
                {
                    BoletoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PasajeroID = table.Column<int>(type: "int", nullable: false),
                    VueloID = table.Column<int>(type: "int", nullable: false),
                    AsientoID = table.Column<int>(type: "int", nullable: false),
                    FechaCompra = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boletos", x => x.BoletoID);
                    table.ForeignKey(
                        name: "FK_Boletos_Asientos_AsientoID",
                        column: x => x.AsientoID,
                        principalTable: "Asientos",
                        principalColumn: "AsientoID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boletos_Pasajeros_PasajeroID",
                        column: x => x.PasajeroID,
                        principalTable: "Pasajeros",
                        principalColumn: "PasajeroID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boletos_Vuelos_VueloID",
                        column: x => x.VueloID,
                        principalTable: "Vuelos",
                        principalColumn: "VueloID",
                        onDelete: ReferentialAction.Cascade);
                });

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
                columns: new[] { "CiudadID", "DuracionEstimadahoras", "Nombre" },
                values: new object[,]
                {
                    { 1, 0, "Lima" },
                    { 2, 1, "Cusco" },
                    { 3, 1, "Arequipa" },
                    { 4, 2, "Piura" },
                    { 5, 2, "Iquitos" }
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

            migrationBuilder.CreateIndex(
                name: "IX_Asientos_VueloID",
                table: "Asientos",
                column: "VueloID");

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_AsientoID",
                table: "Boletos",
                column: "AsientoID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_PasajeroID",
                table: "Boletos",
                column: "PasajeroID");

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_VueloID",
                table: "Boletos",
                column: "VueloID");

            migrationBuilder.CreateIndex(
                name: "IX_Vuelos_AvionID",
                table: "Vuelos",
                column: "AvionID");

            migrationBuilder.CreateIndex(
                name: "IX_Vuelos_DestinoID",
                table: "Vuelos",
                column: "DestinoID");

            migrationBuilder.CreateIndex(
                name: "IX_Vuelos_OrigenID",
                table: "Vuelos",
                column: "OrigenID");

            migrationBuilder.CreateIndex(
                name: "IX_VueloTripulacion_PersonalID",
                table: "VueloTripulacion",
                column: "PersonalID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administradores");

            migrationBuilder.DropTable(
                name: "Boletos");

            migrationBuilder.DropTable(
                name: "VueloTripulacion");

            migrationBuilder.DropTable(
                name: "Asientos");

            migrationBuilder.DropTable(
                name: "Pasajeros");

            migrationBuilder.DropTable(
                name: "Personal");

            migrationBuilder.DropTable(
                name: "Vuelos");

            migrationBuilder.DropTable(
                name: "Aviones");

            migrationBuilder.DropTable(
                name: "Ciudades");
        }
    }
}
