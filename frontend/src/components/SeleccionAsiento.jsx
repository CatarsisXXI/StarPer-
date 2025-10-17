import React, { useEffect, useState } from 'react';
import './SeleccionAsiento.css';

const SeleccionAsiento = ({ vueloId, onAsientoSeleccionado, asientoSeleccionado }) => {
  const [asientos, setAsientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsientos = async () => {
      try {
        const response = await fetch(`http://localhost:5146/api/vuelos/${vueloId}/asientos`);
        if (!response.ok) throw new Error('Error al obtener asientos');
        const data = await response.json();
        const asientosData = data.$values || data;
        setAsientos(asientosData);
      } catch (err) {
        setError(err.message);
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

  return (
    <div className="seleccion-asiento">
      <h3>Selecciona tu asiento</h3>
      <div className="avion-layout">
        <div className="cabina">
          <div className="asientos-grid">
            {asientos.map((asiento) => (
              <div
                key={asiento.AsientoID}
                className={`asiento ${
                  !asiento.Disponible
                    ? 'ocupado'
                    : asientoSeleccionado?.AsientoID === asiento.AsientoID
                    ? 'seleccionado'
                    : 'disponible'
                }`}
                onClick={() => handleAsientoClick(asiento)}
              >
                {asiento.NumeroAsiento}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="leyenda">
        <div className="leyenda-item">
          <div className="asiento disponible"></div>
          <span>Disponible</span>
        </div>
        <div className="leyenda-item">
          <div className="asiento seleccionado"></div>
          <span>Seleccionado</span>
        </div>
        <div className="leyenda-item">
          <div className="asiento ocupado"></div>
          <span>Ocupado</span>
        </div>
      </div>

      {asientoSeleccionado && (
        <div className="asiento-seleccionado-info">
          <h4>Asiento seleccionado: {asientoSeleccionado.NumeroAsiento}</h4>
        </div>
      )}
    </div>
  );
};

export default SeleccionAsiento;
