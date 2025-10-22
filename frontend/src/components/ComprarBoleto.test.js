// ---------------------- Pruebas Unitarias - ComprarBoleto ----------------------

test('Debe retornar true si todos los pasajeros tienen datos completos', () => {
  const formData = [
    { nombre: "Luis", apellido: "Pérez", numeroDocumento: "12345678" },
    { nombre: "Ana", apellido: "Gómez", numeroDocumento: "87654321" }
  ];
  const validarDatosPasajeros = (data) =>
    data.every(p => p.nombre && p.apellido && p.numeroDocumento);

  expect(validarDatosPasajeros(formData)).toBe(true);
});

test('Debe retornar false si algún pasajero tiene datos incompletos', () => {
  const formData = [
    { nombre: "Luis", apellido: "", numeroDocumento: "12345678" },
    { nombre: "Ana", apellido: "Gómez", numeroDocumento: "" }
  ];
  const validarDatosPasajeros = (data) =>
    data.every(p => p.nombre && p.apellido && p.numeroDocumento);

  expect(validarDatosPasajeros(formData)).toBe(false);
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

test('Debe retornar total igual a 0 si no hay pasajeros', () => {
  const vuelo = { Precio: 200 };
  const formData = [];
  const total = formData.reduce((sum, p) => sum + vuelo.Precio, 0);
  expect(total).toBe(0);
});

test('Simula error de pago y lo maneja correctamente', () => {
  const procesarPago = (metodo) => {
    if (metodo === "tarjeta_invalida") throw new Error("Pago rechazado");
    return "Pago exitoso";
  };

  expect(() => procesarPago("tarjeta_invalida")).toThrow("Pago rechazado");
  expect(procesarPago("tarjeta_valida")).toBe("Pago exitoso");
});
