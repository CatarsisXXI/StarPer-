import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import './MisBoletos.css';

const MisBoletos = () => {
  const { user } = useAuth();
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const response = await api.get(`/boleto/pasajero/${user.PasajeroID}`);
        setBoletos(response.data);
      } catch (err) {
        setError('Error al cargar los boletos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.PasajeroID) {
      fetchBoletos();
    }
  }, [user]);

  const generarPDF = (boleto) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("STARPERU - Boleto de Pasajero", 20, 20);

    doc.setFontSize(12);
    doc.text(`Código de boleto: ${boleto.BoletoID}`, 20, 40);
    doc.text(`Pasajero: ${user.nombre} ${user.apellido || ''}`, 20, 50);
    doc.text(`Vuelo: ${boleto.Vuelo?.Origen?.Nombre} → ${boleto.Vuelo?.Destino?.Nombre}`, 20, 60);
    doc.text(`Fecha salida: ${new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleString()}`, 20, 70);
    doc.text(`Fecha llegada: ${new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleString()}`, 20, 80);
    doc.text(`Asiento: ${boleto.Asiento?.NumeroAsiento}`, 20, 90);
    doc.text(`Precio: S/ ${boleto.Precio}`, 20, 100);
    doc.text(`Fecha compra: ${new Date(boleto.FechaCompra).toLocaleString()}`, 20, 110);

    doc.text("----------------------------", 20, 130);
    doc.text("¡Gracias por volar con StarPeru!", 20, 140);

    doc.save(`Boleto_${boleto.BoletoID}.pdf`);
  };

  if (loading) return <div className="loading">Cargando tus boletos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mis-boletos-container">
      <h2>Mis Boletos</h2>

      {boletos.length === 0 ? (
        <div className="no-boletos">
          <p>No tienes boletos comprados aún.</p>
          <a href="/buscar-vuelos" className="btn-primary">Buscar Vuelos</a>
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

              <div className="boleto-detalles">
                <div className="vuelo-info">
                  <p><strong>Vuelo:</strong> {boleto.Vuelo?.Origen?.Nombre} → {boleto.Vuelo?.Destino?.Nombre}</p>
                  <p><strong>Fecha salida:</strong> {new Date(boleto.Vuelo?.FechaHoraSalida).toLocaleString()}</p>
                  <p><strong>Fecha llegada:</strong> {new Date(boleto.Vuelo?.FechaHoraLlegada).toLocaleString()}</p>
                  <p><strong>Asiento:</strong> {boleto.Asiento?.NumeroAsiento}</p>
                  <p><strong>Precio:</strong> S/ {boleto.Precio}</p>
                </div>
              </div>

              <div className="boleto-acciones">
                <button
                  className="btn-descargar"
                  onClick={() => generarPDF(boleto)}
                >
                  📄 Descargar PDF
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
