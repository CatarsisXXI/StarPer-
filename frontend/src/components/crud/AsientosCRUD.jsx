import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const AsientosCRUD = () => {
  const [asientos, setAsientos] = useState([]);
  const [vueloID, setVueloID] = useState('');
  const [numeroAsiento, setNumeroAsiento] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAsientos();
  }, []);

  const fetchAsientos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Asientos');
      const data = response.data?.$values || [];
      setAsientos(data);
      console.log('Respuesta API Asientos:', data);
    } catch (error) {
      console.error('Error fetching asientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!vueloID || !numeroAsiento) return;

    try {
      setSubmitting(true);
      await api.post('/Asientos', {
        vueloID: parseInt(vueloID),
        numeroAsiento: numeroAsiento.trim(),
        disponible: disponible,
      });
      clearForm();
      fetchAsientos();
    } catch (error) {
      console.error('Error adding asiento:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (asiento) => {
    setEditingId(asiento.asientoID);
    setVueloID(asiento.vueloID);
    setNumeroAsiento(asiento.numeroAsiento);
    setDisponible(asiento.disponible);
  };

  const handleUpdate = async () => {
    if (!vueloID || !numeroAsiento) return;

    try {
      setSubmitting(true);
      await api.put(`/Asientos/${editingId}`, {
        vueloID: parseInt(vueloID),
        numeroAsiento: numeroAsiento.trim(),
        disponible: disponible,
      });
      clearForm();
      fetchAsientos();
    } catch (error) {
      console.error('Error updating asiento:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este asiento?')) return;

    try {
      await api.delete(`/Asientos/${id}`);
      fetchAsientos();
    } catch (error) {
      console.error('Error deleting asiento:', error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setVueloID('');
    setNumeroAsiento('');
    setDisponible(true);
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon"><span>💺</span></div>
          <div>
            <h1>Gestión de Asientos</h1>
            <p>Administra los asientos de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        <div className="crud-form-card">
          <h2>{editingId ? 'Editar Asiento' : 'Agregar Nuevo Asiento'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="vueloID">Vuelo ID</label>
              <input
                id="vueloID"
                type="number"
                value={vueloID}
                onChange={(e) => setVueloID(e.target.value)}
                className="form-input"
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numeroAsiento">Número de Asiento</label>
              <input
                id="numeroAsiento"
                type="text"
                value={numeroAsiento}
                onChange={(e) => setNumeroAsiento(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="disponible">Disponible</label>
              <select
                id="disponible"
                value={disponible}
                onChange={(e) => setDisponible(e.target.value === 'true')}
                className="form-input"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={submitting || !vueloID || !numeroAsiento}
                  className="btn btn-primary"
                >
                  {submitting ? 'Actualizando...' : 'Actualizar Asiento'}
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
                disabled={submitting || !vueloID || !numeroAsiento}
                className="btn btn-primary"
              >
                {submitting ? 'Agregando...' : 'Agregar Asiento'}
              </button>
            )}
          </div>
        </div>

        <div className="crud-table-card">
          <div className="table-header">
            <h2>Lista de Asientos</h2>
            <span className="record-count">{asientos.length} asientos registrados</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando asientos...</p>
            </div>
          ) : asientos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💺</span>
              <h3>No hay asientos registrados</h3>
              <p>Agrega el primer asiento para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vuelo ID</th>
                    <th>Número de Asiento</th>
                    <th>Disponible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asientos.map((asiento) => (
                    <tr key={asiento.asientoID}>
                      <td>{asiento.vueloID}</td>
                      <td>{asiento.numeroAsiento}</td>
                      <td>{asiento.disponible ? 'Sí' : 'No'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(asiento)}
                            className="btn btn-edit"
                            title="Editar asiento"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(asiento.asientoID)}
                            className="btn btn-delete"
                            title="Eliminar asiento"
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

export default AsientosCRUD;
