-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE StarPeruDB;
GO
USE StarPeruDB;
GO

-- ============================================
-- TABLAS
-- ============================================

-- Administradores
CREATE TABLE Administradores (
    AdminID INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(200) NOT NULL,
    Rol NVARCHAR(50) NOT NULL DEFAULT 'Administrador'
);

-- Pasajeros
CREATE TABLE Pasajeros (
    PasajeroID INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Telefono NVARCHAR(20)
);

-- Ciudades
CREATE TABLE Ciudades (
    CiudadID INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    CodigoIATA NVARCHAR(10) NOT NULL,
    DuracionEstimadahoras INT NOT NULL -- duración de vuelo estándar desde Lima
);

-- Aviones
CREATE TABLE Aviones (
    AvionID INT IDENTITY PRIMARY KEY,
    Modelo NVARCHAR(100) NOT NULL,
    Capacidad INT NOT NULL
);

-- Vuelos
CREATE TABLE Vuelos (
    VueloID INT IDENTITY PRIMARY KEY,
    OrigenID INT NOT NULL,
    DestinoID INT NOT NULL,
    AvionID INT NOT NULL,
    FechaHoraSalida DATETIME NOT NULL,
    FechaHoraLlegada DATETIME NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrigenID) REFERENCES Ciudades(CiudadID),
    FOREIGN KEY (DestinoID) REFERENCES Ciudades(CiudadID),
    FOREIGN KEY (AvionID) REFERENCES Aviones(AvionID)
);

-- Asientos
CREATE TABLE Asientos (
    AsientoID INT IDENTITY PRIMARY KEY,
    VueloID INT NOT NULL,
    NumeroAsiento NVARCHAR(10) NOT NULL,
    Disponible BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (VueloID) REFERENCES Vuelos(VueloID)
);

-- Personal
CREATE TABLE Personal (
    PersonalID INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Puesto NVARCHAR(50) NOT NULL
);

-- Tripulación asignada a vuelos
CREATE TABLE VueloTripulacion (
    VueloID INT NOT NULL,
    PersonalID INT NOT NULL,
    RolAsignado NVARCHAR(50) NOT NULL,
    PRIMARY KEY (VueloID, PersonalID),
    FOREIGN KEY (VueloID) REFERENCES Vuelos(VueloID),
    FOREIGN KEY (PersonalID) REFERENCES Personal(PersonalID)
);

-- Boletos
CREATE TABLE Boletos (
    BoletoID INT IDENTITY PRIMARY KEY,
    PasajeroID INT NOT NULL,
    VueloID INT NOT NULL,
    AsientoID INT NOT NULL,
    FechaCompra DATETIME NOT NULL DEFAULT GETDATE(),
    Precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (PasajeroID) REFERENCES Pasajeros(PasajeroID),
    FOREIGN KEY (VueloID) REFERENCES Vuelos(VueloID),
    FOREIGN KEY (AsientoID) REFERENCES Asientos(AsientoID)
);

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Insertar vuelo (calcula llegada y genera asientos automáticamente)
CREATE OR ALTER PROCEDURE sp_InsertarVuelo
    @OrigenID INT,
    @DestinoID INT,
    @AvionID INT,
    @FechaHoraSalida DATETIME,
    @Precio DECIMAL(10,2)
AS
BEGIN
    DECLARE @DuracionHoras INT, @FechaHoraLlegada DATETIME, @VueloID INT, @Capacidad INT, @i INT = 1;

    SELECT @DuracionHoras = DuracionEstimadahoras FROM Ciudades WHERE CiudadID = @DestinoID;
    SET @FechaHoraLlegada = DATEADD(HOUR, @DuracionHoras, @FechaHoraSalida);

    INSERT INTO Vuelos (OrigenID, DestinoID, AvionID, FechaHoraSalida, FechaHoraLlegada, Precio)
    VALUES (@OrigenID, @DestinoID, @AvionID, @FechaHoraSalida, @FechaHoraLlegada, @Precio);

    SET @VueloID = SCOPE_IDENTITY();

    SELECT @Capacidad = Capacidad FROM Aviones WHERE AvionID = @AvionID;

    WHILE @i <= @Capacidad
    BEGIN
        INSERT INTO Asientos (VueloID, NumeroAsiento) VALUES (@VueloID, CONCAT('A', @i));
        SET @i += 1;
    END
END;
GO

-- Comprar boleto
CREATE OR ALTER PROCEDURE sp_ComprarBoleto
    @PasajeroID INT,
    @VueloID INT,
    @AsientoID INT
AS
BEGIN
    DECLARE @Precio DECIMAL(10,2);
    SELECT @Precio = Precio FROM Vuelos WHERE VueloID = @VueloID;

    UPDATE Asientos SET Disponible = 0 WHERE AsientoID = @AsientoID AND VueloID = @VueloID;

    INSERT INTO Boletos (PasajeroID, VueloID, AsientoID, Precio)
    VALUES (@PasajeroID, @VueloID, @AsientoID, @Precio);
END;
GO

-- Reporte de ventas por vuelo
CREATE OR ALTER PROCEDURE sp_ReporteVentasPorVuelo
AS
BEGIN
    SELECT v.VueloID, c1.Nombre AS Origen, c2.Nombre AS Destino,
           COUNT(b.BoletoID) AS TotalBoletos, SUM(b.Precio) AS TotalRecaudado
    FROM Vuelos v
    LEFT JOIN Boletos b ON v.VueloID = b.VueloID
    INNER JOIN Ciudades c1 ON v.OrigenID = c1.CiudadID
    INNER JOIN Ciudades c2 ON v.DestinoID = c2.CiudadID
    GROUP BY v.VueloID, c1.Nombre, c2.Nombre;
END;
GO

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar administrador inicial
INSERT INTO Administradores (Nombre, Apellido, Email, PasswordHash)
VALUES ('Admin', 'Principal', 'admin@starperu.com',
'$2b$12$WPWaeP7tm1amuykoVAafq.xaAdL1lCOsdF30463ce2Hj.fa/WVVFG');

-- Ciudades (ejemplo)
INSERT INTO Ciudades (Nombre, CodigoIATA, DuracionEstimadahoras) VALUES
('Lima', 'LIM', 0),
('Cusco', 'CUZ', 1),
('Arequipa', 'AQP', 1),
('Piura', 'PIU', 2),
('Iquitos', 'IQT', 2);

-- Aviones (ejemplo)
INSERT INTO Aviones (Modelo, Capacidad) VALUES
('Airbus A320', 150),
('Boeing 737', 180);

-- Personal (ejemplo)
INSERT INTO Personal (Nombre, Apellido, Puesto) VALUES
('Juan', 'Perez', 'Piloto'),
('Maria', 'Lopez', 'Copiloto'),
('Ana', 'Ramirez', 'Azafata');

-- Crear un vuelo de ejemplo
EXEC sp_InsertarVuelo @OrigenID = 1, @DestinoID = 2, @AvionID = 1, @FechaHoraSalida = '2025-10-05 08:00', @Precio = 300.00;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================