import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import './MisBoletos.css';

const MisBoletos = () => {
  const { user } = useAuth();
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.PasajeroID) {
      fetchBoletos();
    }
  }, [user]);

  const fetchBoletos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boleto/pasajero/${user.PasajeroID}`);
      const data = response.data.$values || response.data;
      setBoletos(data);
    } catch (err) {
      setError('Error al cargar los boletos');
      console.error('Error fetching boletos:', err);
    } finally {
      setLoading(false);
    }
  };

  const imprimirBoleto = (boleto) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("STARPERU - Boleto de Pasajero", 20, 20);

    doc.setFontSize(12);
    doc.text(`Boleto ID: ${boleto.BoletoID}`, 20, 40);
    doc.text(`Pasajero: ${user.Nombre} ${user.Apellido}`, 20, 50);
    doc.text(`Email: ${user.Email}`, 20, 60);

    doc.text("----- Detalles del vuelo -----", 20, 80);
    doc.text(`Origen: ${boleto.Vuelo?.Origen?.Nombre || "—"}`, 20, 90);
    doc.text(`Destino: ${boleto.Vuelo?.Destino?.Nombre || "—"}`, 20, 100);
    doc.text(`Fecha salida: ${new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleDateString()}`, 20, 110);
    doc.text(`Hora salida: ${new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleTimeString()}`, 20, 120);
    doc.text(`Fecha llegada: ${new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleDateString()}`, 20, 130);
    doc.text(`Hora llegada: ${new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleTimeString()}`, 20, 140);

    doc.text("----- Detalles del asiento -----", 20, 160);
    doc.text(`Número de asiento: ${boleto.Asiento?.Numero || "—"}`, 20, 170);
    doc.text(`Clase: ${boleto.Asiento?.Clase || "—"}`, 20, 180);

    doc.text("----- Información de compra -----", 20, 200);
    doc.text(`Fecha de compra: ${new Date(boleto.FechaCompra).toLocaleDateString()}`, 20, 210);
    doc.text(`Precio: S/ ${boleto.Precio}`, 20, 220);

    doc.text("----------------------------", 20, 240);
    doc.text("¡Gracias por volar con StarPeru!", 20, 250);

    doc.save(`Boleto_${boleto.BoletoID}_StarPeru.pdf`);
  };

  if (loading) {
    return <div className="mis-boletos-container">
      <div className="loading">Cargando tus boletos...</div>
    </div>;
  }

  if (error) {
    return <div className="mis-boletos-container">
      <div className="error">{error}</div>
    </div>;
  }

  return (
    <div className="mis-boletos-container">
      <h1>Mis Boletos</h1>
      <p className="subtitle">Aquí puedes ver todos tus boletos comprados</p>

      {boletos.length === 0 ? (
        <div className="no-boletos">
          <h3>No tienes boletos comprados aún</h3>
          <p>¡Empieza a planear tu próximo viaje!</p>
        </div>
      ) : (
        <div className="boletos-list">
          {boletos.map((boleto) => (
            <div key={boleto.BoletoID} className="boleto-card">
              <div className="boleto-header">
                <h3>Boleto #{boleto.BoletoID}</h3>
                <span className="fecha-compra">
                  Comprado: {new Date(boleto.FechaCompra).toLocaleDateString()}
                </span>
              </div>

              <div className="boleto-content">
                <div className="vuelo-info">
                  <div className="ruta">
                    <span className="origen">{boleto.Vuelo?.Origen?.Nombre || "—"}</span>
                    <span className="flecha">→</span>
                    <span className="destino">{boleto.Vuelo?.Destino?.Nombre || "—"}</span>
                  </div>
                  <div className="fecha-hora">
                    <p>Salida: {new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleDateString()} - {new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleTimeString()}</p>
                    <p>Llegada: {new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleDateString()} - {new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="asiento-info">
                  <h4>Asiento</h4>
                  <p>Número: {boleto.Asiento?.Numero || "—"}</p>
                  <p>Clase: {boleto.Asiento?.Clase || "—"}</p>
                </div>

                <div className="precio-info">
                  <h4>Precio</h4>
                  <p className="precio">S/ {boleto.Precio}</p>
                </div>
              </div>

              <div className="boleto-actions">
                <button
                  className="btn-imprimir"
                  onClick={() => imprimirBoleto(boleto)}
                >
                  🖨️ Imprimir Boleto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisBoletos;
