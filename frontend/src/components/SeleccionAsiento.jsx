import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './SeleccionAsiento.css';

const SeleccionAsiento = ({ vueloId, onAsientoSeleccionado, asientoSeleccionado }) => {
  const [asientos, setAsientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsientos = async () => {
      try {
        const response = await api.get(`/vuelos/${vueloId}/asientos`);
        setAsientos(response.data);
      } catch (err) {
        setError('Error al cargar los asientos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (vueloId) {
      fetchAsientos();
    }
  }, [vueloId]);

  const handleAsientoClick = (asiento) => {
    if (asiento.Disponible) {
      onAsientoSeleccionado(asiento);
    }
  };

  if (loading) return <div className="loading">Cargando asientos...</div>;
  if (error) return <div className="error">{error}</div>;

  // Organizar asientos en filas (asumiendo 6 asientos por fila)
  const filas = [];
  for (let i = 0; i < asientos.length; i += 6) {
    filas.push(asientos.slice(i, i + 6));
  }

  return (
    <div className="seleccion-asiento">
      <h3>Selecciona tu asiento</h3>
      <div className="avion-layout">
        <div className="cabina">
          {filas.map((fila, filaIndex) => (
            <div key={filaIndex} className="fila">
              <span className="numero-fila">{filaIndex + 1}</span>
              <div className="asientos-fila">
                {fila.map((asiento) => (
                  <button
                    key={asiento.AsientoID}
                    className={`asiento ${
                      asiento.Disponible ? 'disponible' : 'ocupado'
                    } ${
                      asientoSeleccionado && asientoSeleccionado.AsientoID === asiento.AsientoID
                        ? 'seleccionado'
                        : ''
                    }`}
                    onClick={() => handleAsientoClick(asiento)}
                    disabled={!asiento.Disponible}
                    title={`Asiento ${asiento.NumeroAsiento} - ${asiento.Disponible ? 'Disponible' : 'Ocupado'}`}
                  >
                    {asiento.NumeroAsiento}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="leyenda">
          <div className="leyenda-item">
            <div className="asiento disponible"></div>
            <span>Disponible</span>
          </div>
          <div className="leyenda-item">
            <div className="asiento ocupado"></div>
            <span>Ocupado</span>
          </div>
          <div className="leyenda-item">
            <div className="asiento seleccionado"></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionAsiento;
