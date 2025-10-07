import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const AsignarPersonalCRUD = () => {
  const [tripulaciones, setTripulaciones] = useState([]);
  const [vueloID, setVueloID] = useState('');
  const [personalID, setPersonalID] = useState('');
  const [puesto, setPuesto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [vuelos, setVuelos] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [personalFiltrado, setPersonalFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTripulaciones();
    fetchVuelos();
    fetchPersonal();
  }, []);

  useEffect(() => {
    if (puesto) {
      setPersonalFiltrado(personal.filter(persona => persona.Puesto === puesto));
    } else {
      setPersonalFiltrado(personal);
    }
  }, [puesto, personal]);

  // ✅ Fetch tripulaciones
  const fetchTripulaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/AsignarPersonal'); // Ajustado a la ruta relativa correcta
      setTripulaciones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tripulaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVuelos = async () => {
    try {
      const response = await api.get('/Vuelos');
      setVuelos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching vuelos:', error);
    }
  };

  const fetchPersonal = async () => {
    try {
      const response = await api.get('/Personal');
      setPersonal(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching personal:', error);
    }
  };

  // ✅ Añadir asignación
  const handleAdd = async () => {
    if (!vueloID || !personalID || !puesto.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/AsignarPersonal', {
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

  // ✅ Editar asignación
  const handleEdit = (tripulacion) => {
    setEditingId(`${tripulacion.VueloID}-${tripulacion.PersonalID}`);
    setVueloID(tripulacion.VueloID.toString());
    setPersonalID(tripulacion.PersonalID.toString());
    setPuesto(tripulacion.rolAsignado);
  };

  // ✅ Actualizar asignación
  const handleUpdate = async () => {
    if (!vueloID || !personalID || !puesto.trim()) return;

    try {
      setSubmitting(true);
      await api.put(`/AsignarPersonal/${vueloID}/${personalID}`, {
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

  // ✅ Eliminar asignación
  const handleDelete = async (vueloId, personalId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta asignación de personal?')) return;

    try {
      await api.delete(`/AsignarPersonal/${vueloId}/${personalId}`);
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
                {vuelos.map((vuelo) => (
                  <option key={vuelo.VueloID} value={vuelo.VueloID}>
                    Vuelo {vuelo.VueloID} - {vuelo.origen?.nombre} → {vuelo.destino?.nombre}
                  </option>
                ))}
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
                {personalFiltrado.map((persona) => (
                  <option key={persona.PersonalID} value={persona.PersonalID}>
                    {persona.Nombre} {persona.Apellido} - {persona.Puesto}
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
                  {tripulaciones.map((tripulacion) => (
                    <tr key={`${tripulacion.VueloID}-${tripulacion.PersonalID}`}>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">Vuelo {tripulacion.VueloID}</span>
                          <span className="model-subtitle">
                            {tripulacion.vuelo?.origen?.nombre} → {tripulacion.vuelo?.destino?.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">
                            {tripulacion.personal?.Nombre} {tripulacion.personal?.Apellido}
                          </span>
                          <span className="model-subtitle">{tripulacion.personal?.Puesto}</span>
                        </div>
                      </td>
                      <td>
                        <span className="capacity-badge">{tripulacion.rolAsignado}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(tripulacion)}
                            className="btn btn-edit"
                            title="Editar asignación"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(tripulacion.VueloID, tripulacion.PersonalID)}
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
