import React, { useState } from 'react';
import './PagoBoleto.css';

const PagoBoleto = ({ total, onPagoCompletado, onVolver }) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: '',
    email: '',
    telefono: ''
  });
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPago(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarDatosPago = () => {
    if (!metodoPago) {
      setError('Selecciona un método de pago');
      return false;
    }

    if (metodoPago === 'tarjeta') {
      const { numeroTarjeta, fechaExpiracion, cvv, nombreTitular } = datosPago;
      if (!numeroTarjeta || !fechaExpiracion || !cvv || !nombreTitular) {
        setError('Completa todos los campos de la tarjeta');
        return false;
      }
      if (numeroTarjeta.replace(/\s/g, '').length !== 16) {
        setError('El número de tarjeta debe tener 16 dígitos');
        return false;
      }
      if (cvv.length !== 3) {
        setError('El CVV debe tener 3 dígitos');
        return false;
      }
    }

    return true;
  };

  const handlePago = async () => {
    if (!validarDatosPago()) return;

    setProcesando(true);
    setError('');

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En un escenario real, aquí se integraría con un gateway de pagos
      // Por ahora, simulamos un pago exitoso
      onPagoCompletado({
        metodoPago,
        datosPago,
        fechaPago: new Date(),
        estado: 'completado'
      });
    } catch (err) {
      setError('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const formatearNumeroTarjeta = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleNumeroTarjetaChange = (e) => {
    const formatted = formatearNumeroTarjeta(e.target.value);
    setDatosPago(prev => ({
      ...prev,
      numeroTarjeta: formatted
    }));
  };

  return (
    <div className="pago-boleto">
      <h3>Información de Pago</h3>

      <div className="resumen-pago">
        <h4>Resumen de la compra</h4>
        <div className="total-pago">
          <span>Total a pagar:</span>
          <span className="monto">S/ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="metodo-pago">
        <h4>Método de pago</h4>
        <div className="opciones-pago">
          <label className="opcion-pago">
            <input
              type="radio"
              name="metodoPago"
              value="tarjeta"
              checked={metodoPago === 'tarjeta'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="radio-custom"></span>
            Tarjeta de Crédito/Débito
          </label>
          <label className="opcion-pago">
            <input
              type="radio"
              name="metodoPago"
              value="yape"
              checked={metodoPago === 'yape'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="radio-custom"></span>
            Yape
          </label>
          <label className="opcion-pago">
            <input
              type="radio"
              name="metodoPago"
              value="plin"
              checked={metodoPago === 'plin'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="radio-custom"></span>
            Plin
          </label>
        </div>
      </div>

      {metodoPago === 'tarjeta' && (
        <div className="formulario-tarjeta">
          <div className="campo-grupo">
            <label>Número de tarjeta</label>
            <input
              type="text"
              name="numeroTarjeta"
              value={datosPago.numeroTarjeta}
              onChange={handleNumeroTarjetaChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>

          <div className="campo-fila">
            <div className="campo-grupo">
              <label>Fecha de expiración</label>
              <input
                type="text"
                name="fechaExpiracion"
                value={datosPago.fechaExpiracion}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setDatosPago(prev => ({
                    ...prev,
                    fechaExpiracion: value
                  }));
                }}
                placeholder="MM/AA"
                maxLength="5"
              />
            </div>
            <div className="campo-grupo">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={datosPago.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label>Nombre del titular</label>
            <input
              type="text"
              name="nombreTitular"
              value={datosPago.nombreTitular}
              onChange={handleInputChange}
              placeholder="Como aparece en la tarjeta"
            />
          </div>
        </div>
      )}

      {(metodoPago === 'yape' || metodoPago === 'plin') && (
        <div className="formulario-movil">
          <div className="campo-grupo">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={datosPago.telefono}
              onChange={handleInputChange}
              placeholder="9XXXXXXXX"
            />
          </div>
          <div className="campo-grupo">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={datosPago.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
            />
          </div>
          <div className="instrucciones-pago">
            <p>Recibirás un código de confirmación en tu teléfono para completar el pago.</p>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="acciones-pago">
        <button
          className="btn-volver"
          onClick={onVolver}
          disabled={procesando}
        >
          ← Volver
        </button>
        <button
          className="btn-pagar"
          onClick={handlePago}
          disabled={procesando || !metodoPago}
        >
          {procesando ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PagoBoleto;
