import React, { useState } from 'react';
import './PagoBoleto.css';

const PagoBoleto = ({ total, onPagoCompletado, onVolver }) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: '',
    // Para Yape/Plin
    numeroTelefono: '',
    // Para transferencia
    numeroCuenta: '',
    banco: ''
  });
  const [procesandoPago, setProcesandoPago] = useState(false);

  const handleInputChange = (field, value) => {
    setDatosPago(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePago = async () => {
    if (!metodoPago) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    // Validar campos según método de pago
    if (metodoPago === 'tarjeta') {
      if (!datosPago.numeroTarjeta || !datosPago.fechaExpiracion || !datosPago.cvv || !datosPago.nombreTitular) {
        alert('Por favor completa todos los campos de la tarjeta');
        return;
      }
    } else if (metodoPago === 'yape' || metodoPago === 'plin') {
      if (!datosPago.numeroTelefono) {
        alert('Por favor ingresa tu número de teléfono');
        return;
      }
    } else if (metodoPago === 'transferencia') {
      if (!datosPago.numeroCuenta || !datosPago.banco) {
        alert('Por favor completa los datos de la cuenta bancaria');
        return;
      }
    }

    setProcesandoPago(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      setProcesandoPago(false);
      onPagoCompletado({
        metodo: metodoPago,
        datos: datosPago,
        fechaPago: new Date().toISOString()
      });
    }, 2000);
  };

  const formatCardNumber = (value) => {
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

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="pago-container">
      <h3>Información de Pago</h3>

      <div className="total-pago">
        <h4>Total a pagar:</h4>
        <p className="monto-total">S/ {total.toFixed(2)}</p>
      </div>

      <div className="metodo-pago-section">
        <h4>Selecciona método de pago</h4>
        <div className="metodos-pago">
          <label className="metodo-option">
            <input
              type="radio"
              value="tarjeta"
              checked={metodoPago === 'tarjeta'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div className="metodo-content">
              <span className="metodo-icon">💳</span>
              <span>Tarjeta de Crédito/Débito</span>
            </div>
          </label>

          <label className="metodo-option">
            <input
              type="radio"
              value="yape"
              checked={metodoPago === 'yape'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div className="metodo-content">
              <span className="metodo-icon">📱</span>
              <span>Yape</span>
            </div>
          </label>

          <label className="metodo-option">
            <input
              type="radio"
              value="plin"
              checked={metodoPago === 'plin'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div className="metodo-content">
              <span className="metodo-icon">📱</span>
              <span>Plin</span>
            </div>
          </label>

          <label className="metodo-option">
            <input
              type="radio"
              value="transferencia"
              checked={metodoPago === 'transferencia'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div className="metodo-content">
              <span className="metodo-icon">🏦</span>
              <span>Transferencia Bancaria</span>
            </div>
          </label>
        </div>
      </div>

      {/* Formulario de Tarjeta */}
      {metodoPago === 'tarjeta' && (
        <div className="formulario-pago">
          <div className="form-row">
            <div className="form-group">
              <label>Número de tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={datosPago.numeroTarjeta}
                onChange={(e) => handleInputChange('numeroTarjeta', formatCardNumber(e.target.value))}
                maxLength="19"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de expiración</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={datosPago.fechaExpiracion}
                onChange={(e) => handleInputChange('fechaExpiracion', formatExpiry(e.target.value))}
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={datosPago.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="4"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre del titular</label>
              <input
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={datosPago.nombreTitular}
                onChange={(e) => handleInputChange('nombreTitular', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Formulario Yape/Plin */}
      {(metodoPago === 'yape' || metodoPago === 'plin') && (
        <div className="formulario-pago">
          <div className="metodo-info">
            <div className="qr-placeholder">
              <div className="qr-code">
                <span className="metodo-icon-large">{metodoPago === 'yape' ? '📱' : '📱'}</span>
                <p>Escanea el código QR con tu app {metodoPago === 'yape' ? 'Yape' : 'Plin'}</p>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Número de teléfono</label>
              <input
                type="tel"
                placeholder="9XXXXXXXX"
                value={datosPago.numeroTelefono}
                onChange={(e) => handleInputChange('numeroTelefono', e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="9"
              />
            </div>
          </div>
        </div>
      )}

      {/* Formulario Transferencia */}
      {metodoPago === 'transferencia' && (
        <div className="formulario-pago">
          <div className="transferencia-info">
            <div className="cuenta-info">
              <h5>Datos de la cuenta de Star Perú:</h5>
              <p><strong>Banco:</strong> BCP</p>
              <p><strong>Número de cuenta:</strong> 123-456789-012</p>
              <p><strong>CCI:</strong> 00212300456789012</p>
              <p><strong>Titular:</strong> Star Perú Airlines S.A.</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tu número de cuenta</label>
              <input
                type="text"
                placeholder="Número de cuenta desde donde transfieres"
                value={datosPago.numeroCuenta}
                onChange={(e) => handleInputChange('numeroCuenta', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Banco</label>
              <select
                value={datosPago.banco}
                onChange={(e) => handleInputChange('banco', e.target.value)}
              >
                <option value="">Selecciona tu banco</option>
                <option value="BCP">BCP</option>
                <option value="Interbank">Interbank</option>
                <option value="BBVA">BBVA</option>
                <option value="Scotiabank">Scotiabank</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="acciones-pago">
        <button
          className="btn-volver"
          onClick={onVolver}
          disabled={procesandoPago}
        >
          ← Volver
        </button>
        <button
          className="btn-pagar"
          onClick={handlePago}
          disabled={procesandoPago || !metodoPago}
        >
          {procesandoPago ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PagoBoleto;
