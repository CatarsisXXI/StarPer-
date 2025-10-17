import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './SeleccionAsiento.css';

const SeleccionAsiento = ({ vueloId, numPasajeros, onAsientosSeleccionados, asientosSeleccionados }) => {
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

  // Actualizar asientos cuando cambie la selección para refrescar el estado visual
  useEffect(() => {
    // Forzar re-render para actualizar colores de asientos
    setAsientos(prev => [...prev]);
  }, [asientosSeleccionados]);

  const handleAsientoClick = (asiento) => {
    if (!asiento.Disponible) return;

    const isSelected = asientosSeleccionados.some(a => a.AsientoID === asiento.AsientoID);

    if (isSelected) {
      // Deseleccionar asiento
      const nuevosSeleccionados = asientosSeleccionados.filter(a => a.AsientoID !== asiento.AsientoID);
      onAsientosSeleccionados(nuevosSeleccionados);
    } else {
      // Seleccionar asiento (solo si no se ha alcanzado el límite)
      if (asientosSeleccionados.length < numPasajeros) {
        onAsientosSeleccionados([...asientosSeleccionados, asiento]);
      }
    }
  };

  if (loading) return <div className="loading">Cargando asientos...</div>;
  if (error) return <div className="error">{error}</div>;

  // Organizar asientos en filas (asumiendo 6 asientos por fila con pasillo)
  const filas = [];
  for (let i = 0; i < asientos.length; i += 6) {
    filas.push(asientos.slice(i, i + 6));
  }

  return (
    <div className="seleccion-asiento">
      <h3>Selecciona tus asientos ({asientosSeleccionados.length}/{numPasajeros})</h3>
      <div className="avion-layout">
        <div className="cabina">
          {/* Puerta de ingreso */}
          <div className="puerta-ingreso">
            <div className="puerta-icon">🚪</div>
            <span className="puerta-label">Puerta de Ingreso</span>
          </div>

          {filas.map((fila, filaIndex) => (
            <div key={filaIndex} className="fila">
              <span className="numero-fila">{filaIndex + 1}</span>
              <div className="asientos-fila">
                {/* Asientos lado izquierdo */}
                {fila.slice(0, 3).map((asiento) => {
                  const isSelected = asientosSeleccionados.some(a => a.AsientoID === asiento.AsientoID);
                  return (
                    <button
                      key={asiento.AsientoID}
                      className={`asiento ${
                        asiento.Disponible ? 'disponible' : 'ocupado'
                      } ${
                        isSelected ? 'seleccionado' : ''
                      }`}
                      onClick={() => handleAsientoClick(asiento)}
                      disabled={!asiento.Disponible}
                      title={`Asiento ${asiento.NumeroAsiento} - ${asiento.Disponible ? 'Disponible' : 'Ocupado'}`}
                    >
                      {asiento.NumeroAsiento}
                    </button>
                  );
                })}

                {/* Pasillo */}
                <div className="pasillo"></div>

                {/* Asientos lado derecho */}
                {fila.slice(3, 6).map((asiento) => {
                  const isSelected = asientosSeleccionados.some(a => a.AsientoID === asiento.AsientoID);
                  return (
                    <button
                      key={asiento.AsientoID}
                      className={`asiento ${
                        asiento.Disponible ? 'disponible' : 'ocupado'
                      } ${
                        isSelected ? 'seleccionado' : ''
                      }`}
                      onClick={() => handleAsientoClick(asiento)}
                      disabled={!asiento.Disponible}
                      title={`Asiento ${asiento.NumeroAsiento} - ${asiento.Disponible ? 'Disponible' : 'Ocupado'}`}
                    >
                      {asiento.NumeroAsiento}
                    </button>
                  );
                })}
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
