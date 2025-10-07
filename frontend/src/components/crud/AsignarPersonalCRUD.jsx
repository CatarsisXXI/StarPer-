import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const AsignarPersonalCRUD = () => {
  const [tripulaciones, setTripulaciones] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [personalFiltrado, setPersonalFiltrado] = useState([]);
  const [vueloID, setVueloID] = useState('');
  const [personalID, setPersonalID] = useState('');
  const [puesto, setPuesto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Inicializar datos
  useEffect(() => {
    fetchTripulaciones();
    fetchVuelos();
    fetchPersonal();
  }, []);

  // Filtrar personal según puesto y vuelo seleccionado
  useEffect(() => {
    const fetchPersonalFiltrado = async () => {
      if (!puesto) {
        setPersonalFiltrado(personal);
        return;
      }
      try {
        const response = await api.get(`/Personal/available?puesto=${puesto}`);
        let filtrado = Array.isArray(response.data) ? response.data : [];

        // Excluir personal ya asignado al vuelo
        if (vueloID) {
          const asignados = tripulaciones
            .filter(t => t.VueloID === parseInt(vueloID))
            .map(t => t.PersonalID);
          filtrado = filtrado.filter(p => !asignados.includes(p.PersonalID));
        }

        setPersonalFiltrado(filtrado);
      } catch (error) {
        console.error('Error fetching personal filtrado:', error);
        setPersonalFiltrado([]);
      }
    };
    fetchPersonalFiltrado();
  }, [puesto, vueloID, personal, tripulaciones]);

  // Fetch tripulaciones
  const fetchTripulaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tripulacion-vuelo');
      setTripulaciones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tripulaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vuelos
  const fetchVuelos = async () => {
    try {
      const response = await api.get('/Vuelos');
      setVuelos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching vuelos:', error);
    }
  };

  // Fetch todo el personal
  const fetchPersonal = async () => {
    try {
      const response = await api.get('/Personal');
      setPersonal(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching personal:', error);
    }
  };

  // Añadir asignación con validación
  const handleAdd = async () => {
    if (!vueloID || !personalID || !puesto.trim()) return;

    // Verificar si ya hay un personal con ese puesto en el vuelo
    const existePuesto = tripulaciones.some(
      t => t.VueloID === parseInt(vueloID) && t.rolAsignado === puesto
    );
    if (existePuesto) {
      alert(`Ya hay un ${puesto} asignado a este vuelo.`);
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/tripulacion-vuelo', {
        vueloID: parseInt(vueloID),
        personalID: parseInt(personalID),
        rolAsignado: puesto.trim(),
      });
      clearForm();
      fetchTripulaciones();
    } catch (error) {
      console.error('Error adding tripulacion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Editar asignación
  const handleEdit = (tripulacion) => {
    setEditingId(`${tripulacion.VueloID}-${tripulacion.PersonalID}`);
    setVueloID(tripulacion.VueloID.toString());
    setPersonalID(tripulacion.PersonalID.toString());
    setPuesto(tripulacion.rolAsignado);
  };

  // Actualizar asignación con validación
  const handleUpdate = async () => {
    if (!vueloID || !personalID || !puesto.trim()) return;

    const existePuesto = tripulaciones.some(
      t =>
        t.VueloID === parseInt(vueloID) &&
        t.rolAsignado === puesto &&
        `${t.VueloID}-${t.PersonalID}` !== editingId
    );
    if (existePuesto) {
      alert(`Ya hay un ${puesto} asignado a este vuelo.`);
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/tripulacion-vuelo/${vueloID}/${personalID}`, {
        vueloID: parseInt(vueloID),
        personalID: parseInt(personalID),
        rolAsignado: puesto.trim(),
      });
      clearForm();
      fetchTripulaciones();
    } catch (error) {
      console.error('Error updating tripulacion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar asignación
  const handleDelete = async (vueloId, personalId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta asignación de personal?')) return;

    try {
      await api.delete(`/tripulacion-vuelo/${vueloId}/${personalId}`);
      fetchTripulaciones();
    } catch (error) {
      console.error('Error deleting tripulacion:', error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setVueloID('');
    setPersonalID('');
    setPuesto('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon">
            <span>👨‍✈️</span>
          </div>
          <div>
            <h1>Asignar Personal a Vuelos</h1>
            <p>Gestiona las asignaciones de tripulación para los vuelos de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        <div className="crud-form-card">
          <h2>{editingId ? 'Editar Asignación' : 'Nueva Asignación de Personal'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="vueloID">Vuelo</label>
              <select
                id="vueloID"
                value={vueloID}
                onChange={(e) => setVueloID(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccionar Vuelo</option>
                {vuelos.map(v => (
                  <option key={v.VueloID} value={v.VueloID}>
                    {v.Origen?.Nombre || 'Desconocido'} - {v.Destino?.Nombre || 'Desconocido'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="puesto">Puesto Asignado</label>
              <select
                id="puesto"
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccionar Puesto</option>
                <option value="Piloto">Piloto</option>
                <option value="Copiloto">Copiloto</option>
                <option value="Tripulante de Cabina de Pasajeros">Tripulante de Cabina de Pasajeros</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="personalID">Personal</label>
              <select
                id="personalID"
                value={personalID}
                onChange={(e) => setPersonalID(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccionar Personal</option>
                {personalFiltrado.map(p => (
                  <option key={p.PersonalID} value={p.PersonalID}>
                    {p.Nombre} {p.Apellido} - {p.Puesto}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={submitting || !vueloID || !personalID || !puesto.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Actualizando...' : 'Actualizar Asignación'}
                </button>
                <button
                  onClick={clearForm}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                disabled={submitting || !vueloID || !personalID || !puesto.trim()}
                className="btn btn-primary"
              >
                {submitting ? 'Asignando...' : 'Asignar Personal'}
              </button>
            )}
          </div>
        </div>

        <div className="crud-table-card">
          <div className="table-header">
            <h2>Asignaciones de Personal</h2>
            <span className="record-count">{tripulaciones.length} asignaciones activas</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando asignaciones...</p>
            </div>
          ) : tripulaciones.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👨‍✈️</span>
              <h3>No hay asignaciones de personal</h3>
              <p>Asigna personal a los vuelos para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vuelo</th>
                    <th>Personal</th>
                    <th>Puesto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tripulaciones.map(t => (
                    <tr key={`${t.VueloID}-${t.PersonalID}`}>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">
                            {t.vuelo ? `${t.vuelo.Origen?.Nombre} - ${t.vuelo.Destino?.Nombre}` : `Vuelo ${t.VueloID}`}
                          </span>
                        </div>
                      </td>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">
                            {t.personal?.Nombre} {t.personal?.Apellido}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="capacity-badge">{t.rolAsignado}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(t)}
                            className="btn btn-edit"
                            title="Editar asignación"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(t.VueloID, t.PersonalID)}
                            className="btn btn-delete"
                            title="Eliminar asignación"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsignarPersonalCRUD;
