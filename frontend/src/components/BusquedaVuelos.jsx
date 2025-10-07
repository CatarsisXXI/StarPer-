import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './BusquedaVuelos.css';

const BusquedaVuelos = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bebesLabel = 'Bebés (<2 años)';

  const [ciudades, setCiudades] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filtros, setFiltros] = useState({
    origen: searchParams.get('origen') || '',
    destino: searchParams.get('destino') || '',
    fecha: '',
    adultos: 1,
    ninos: 0,
    bebes: 0
  });

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await api.get('/Ciudades');
        const data = response.data.$values || response.data;
        setCiudades(data);
        console.log('Ciudades API:', data);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    };

    fetchCiudades();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handlePasajerosChange = (tipo, operacion) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: operacion === 'incrementar'
        ? prev[tipo] + 1
        : Math.max(0, prev[tipo] - 1)
    }));
  };

  const buscarVuelos = async () => {
    if (!filtros.origen || !filtros.destino) {
      setError('Por favor selecciona origen y destino');
      return;
    }

    if (filtros.origen === filtros.destino) {
      setError('El origen y destino no pueden ser iguales');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/vuelos');
      const rawVuelos = response.data.$values || response.data;
      console.log('Vuelos API:', rawVuelos);

      let vuelosFiltrados = rawVuelos.filter(vuelo =>
  Number(vuelo.OrigenID) === Number(filtros.origen) &&
  Number(vuelo.DestinoID) === Number(filtros.destino)
);

      if (filtros.fecha) {
        const fechaSeleccionada = filtros.fecha;
        vuelosFiltrados = vuelosFiltrados.filter(vuelo => {
          const vueloFecha = new Date(vuelo.FechaHoraSalida).toISOString().slice(0, 10);
          return vueloFecha === fechaSeleccionada;
        });
      }

      console.log('Vuelos filtrados:', vuelosFiltrados);
      setVuelos(vuelosFiltrados);
    } catch (err) {
      setError('Error al buscar vuelos. Inténtalo nuevamente.');
      console.error('Error buscando vuelos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = (vueloId) => {
    if (!user) {
      navigate('/login', { state: { from: `/buscar-vuelos?origen=${filtros.origen}&destino=${filtros.destino}` } });
      return;
    }

    navigate(`/comprar/${vueloId}`, {
      state: {
        vueloId,
        pasajeros: {
          adultos: filtros.adultos,
          ninos: filtros.ninos,
          bebes: filtros.bebes
        }
      }
    });
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="busqueda-container">
      <div className="busqueda-header">
        <h1>Buscar Vuelos</h1>
        <p>Encuentra el vuelo perfecto para tu viaje</p>
      </div>

      <div className="filtros-section">
        <div className="filtros-card">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label htmlFor="origen">Origen</label>
              <select
                id="origen"
                name="origen"
                value={filtros.origen}
                onChange={handleFiltroChange}
              >
                <option value="">Seleccionar origen</option>
                {ciudades.map(ciudad => (
  <option key={ciudad.CiudadID} value={ciudad.CiudadID}>
    {ciudad.Nombre}
  </option>
))}
              </select>
            </div>
            <div className="filtro-group">
              <label htmlFor="destino">Destino</label>
              <select
                id="destino"
                name="destino"
                value={filtros.destino}
                onChange={handleFiltroChange}
              >
                <option value="">Seleccionar destino</option>
                {ciudades
  .filter(c => c && c.CiudadID != null && c.CiudadID.toString() !== filtros.origen)
  .map(ciudad => (
    <option key={ciudad.CiudadID} value={ciudad.CiudadID}>
      {ciudad.Nombre}
    </option>
  ))}
              </select>
            </div>

            <div className="filtro-group">
              <label htmlFor="fecha">Fecha de Salida</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={filtros.fecha}
                onChange={handleFiltroChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="filtro-group">
              <label>Pasajeros</label>
              <div className="pasajeros-selector">
                <div className="pasajero-control">
                  <span>Adultos</span>
                  <div className="control-buttons">
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('adultos', 'decrementar')}
                      disabled={filtros.adultos <= 1}
                    >
                      -
                    </button>
                    <span>{filtros.adultos}</span>
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('adultos', 'incrementar')}
                    >
                    </button>
                  </div>
                </div>

                <div className="pasajero-control">
                  <span>Niños (2-11 años)</span>
                  <div className="control-buttons">
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('ninos', 'decrementar')}
                      disabled={filtros.ninos <= 0}
                    >
                      -
                    </button>
                    <span>{filtros.ninos}</span>
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('ninos', 'incrementar')}
                    >
                    </button>
                  </div>
                </div>

                <div className="pasajero-control">
                  <span>{bebesLabel}</span>
                  <div className="control-buttons">
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('bebes', 'decrementar')}
                      disabled={filtros.bebes <= 0}
                    >
                      -
                    </button>
                    <span>{filtros.bebes}</span>
                    <button
                      type="button"
                      onClick={() => handlePasajerosChange('bebes', 'incrementar')}
                    >
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="buscar-button"
            onClick={buscarVuelos}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar Vuelos'}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* BLOQUE DE VUELOS CON MEJORAS VISUALES */}
      {vuelos.length > 0 && (
        <div className="resultados-section">
          <h2>Vuelos Disponibles</h2>
          <div className="vuelos-list">
            {vuelos.map((vuelo) => {
              const origenNombre = ciudades.find(c => c.CiudadID === vuelo.OrigenID)?.Nombre || "—";
              const destinoNombre = ciudades.find(c => c.CiudadID === vuelo.DestinoID)?.Nombre || "—";
              const avionModelo = vuelo.Avion?.Modelo || "—";

              return (
                <div key={vuelo.VueloID} className="vuelo-card">
  <div className="vuelo-header">
    <div className="ruta">
      <span className="origen">{origenNombre}</span>
      <span className="flecha">→</span>
      <span className="destino">{destinoNombre}</span>
    </div>
    <div className="avion-info">{avionModelo}</div>
  </div>

  <div className="vuelo-detalles">
    <div className="horario">
      <div className="salida">
        <span className="hora">{formatHora(vuelo.FechaHoraSalida)}</span>
        <span className="fecha">{formatFecha(vuelo.FechaHoraSalida)}</span>
      </div>
      <div className="duracion">{vuelo.Duracion || "—"}</div>
      <div className="llegada">
        <span className="hora">{formatHora(vuelo.FechaHoraLlegada)}</span>
        <span className="fecha">{formatFecha(vuelo.FechaHoraLlegada)}</span>
      </div>
    </div>
  </div>

  <div className="vuelo-footer">
    <div className="precio">
      <span className="monto">S/ {vuelo.Precio}</span>
      <span className="por-persona">por persona</span>
    </div>
    <button
      className="comprar-button"
      onClick={() => handleComprar(vuelo.VueloID)}
    >
      Comprar
    </button>
  </div>
</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusquedaVuelos;
