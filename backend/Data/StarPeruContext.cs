using Microsoft.EntityFrameworkCore;
using StarPeru.Api.Models;

namespace StarPeru.Api.Data
{
    public class StarPeruContext : DbContext
    {
        public StarPeruContext(DbContextOptions<StarPeruContext> options) : base(options)
        {
        }

        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Pasajero> Pasajeros { get; set; }
        public DbSet<Ciudad> Ciudades { get; set; }
        public DbSet<Avion> Aviones { get; set; }
        public DbSet<Vuelo> Vuelos { get; set; }
        public DbSet<Asiento> Asientos { get; set; }
        public DbSet<Personal> Personal { get; set; }
        public DbSet<VueloTripulacion> VueloTripulacion { get; set; }
        public DbSet<Boleto> Boletos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar clave compuesta para VueloTripulacion
            modelBuilder.Entity<VueloTripulacion>()
                .HasKey(vt => new { vt.VueloID, vt.PersonalID });

            // Configurar nombres de tablas
            modelBuilder.Entity<Administrador>().ToTable("Administradores");
            modelBuilder.Entity<Pasajero>().ToTable("Pasajeros");
            modelBuilder.Entity<Ciudad>().ToTable("Ciudades");
            modelBuilder.Entity<Avion>().ToTable("Aviones");
            modelBuilder.Entity<Vuelo>().ToTable("Vuelos");
            modelBuilder.Entity<Asiento>().ToTable("Asientos");
            modelBuilder.Entity<Personal>().ToTable("Personal");
            modelBuilder.Entity<VueloTripulacion>().ToTable("VueloTripulacion");
            modelBuilder.Entity<Boleto>().ToTable("Boletos");

            // Configurar eliminación en cascada para asientos cuando se elimina un vuelo
            modelBuilder.Entity<Asiento>()
                .HasOne(a => a.Vuelo)
                .WithMany(v => v.Asientos)
                .HasForeignKey(a => a.VueloID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configurar eliminación en cascada para boletos cuando se elimina un asiento
            modelBuilder.Entity<Boleto>()
                .HasOne(b => b.Asiento)
                .WithOne(a => a.Boleto)
                .HasForeignKey<Boleto>(b => b.AsientoID)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed data removed to avoid conflicts with database.sql
        }
    }
}
