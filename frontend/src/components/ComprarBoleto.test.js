test('Debe retornar true si todos los pasajeros tienen datos completos', () => {
  const formData = [
    { nombre: "Luis", apellido: "Pérez", numeroDocumento: "12345678" },
    { nombre: "Ana", apellido: "Gómez", numeroDocumento: "87654321" }
  ];
  const validarDatosPasajeros = (data) =>
    data.every(p => p.nombre && p.apellido && p.numeroDocumento);

  expect(validarDatosPasajeros(formData)).toBe(true);
});

test('Calcula correctamente el precio total según tipo de pasajero', () => {
  const vuelo = { Precio: 200 };
  const formData = [
    { tipo: 'Adulto' },
    { tipo: 'Niño' },
    { tipo: 'Bebé' },
  ];
  const total = formData.reduce((sum, p) => {
    let precio = vuelo.Precio;
    if (p.tipo === "Niño") precio *= 0.75;
    else if (p.tipo === "Bebé") precio *= 0.5;
    return sum + precio;
  }, 0);
  expect(total).toBe(450);
});
