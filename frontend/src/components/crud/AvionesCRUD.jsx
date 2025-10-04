import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const AvionesCRUD = () => {
  const [aviones, setAviones] = useState([]);
  const [modelo, setModelo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAviones();
  }, []);

  const fetchAviones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Aviones');
      const data = response.data;
      setAviones(Array.isArray(data) ? data : data?.$values || []);
      console.log('Respuesta API Aviones:', data);
    } catch (error) {
      console.error('Error fetching aviones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!modelo.trim() || !capacidad.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/Aviones', {
        modelo: modelo.trim(),
        capacidad: parseInt(capacidad),
      });
      clearForm();
      fetchAviones();
    } catch (error) {
      console.error('Error adding avion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (avion) => {
    setEditingId(avion.avionID);
    setModelo(avion.modelo);
    setCapacidad(avion.capacidad.toString());
  };

  const handleUpdate = async () => {
    if (!modelo.trim() || !capacidad.trim()) return;

    try {
      setSubmitting(true);
      await api.put(`/Aviones/${editingId}`, {
        modelo: modelo.trim(),
        capacidad: parseInt(capacidad),
      });
      clearForm();
      fetchAviones();
    } catch (error) {
      console.error('Error updating avion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este avión?')) return;

    try {
      await api.delete(`/Aviones/${id}`);
      fetchAviones();
    } catch (error) {
      console.error('Error deleting avion:', error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setModelo('');
    setCapacidad('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon">
            <span>✈️</span>
          </div>
          <div>
            <h1>Gestión de Aviones</h1>
            <p>Administra los aviones de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        <div className="crud-form-card">
          <h2>{editingId ? 'Editar Avión' : 'Agregar Nuevo Avión'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input
                id="modelo"
                type="text"
                placeholder="Ej: Airbus A320"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="capacidad">Capacidad</label>
              <input
                id="capacidad"
                type="number"
                placeholder="Ej: 160"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                className="form-input"
                min="1"
              />
            </div>
          </div>
          <div className="form-actions">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={submitting || !modelo.trim() || !capacidad.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Actualizando...' : 'Actualizar Avión'}
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
                disabled={submitting || !modelo.trim() || !capacidad.trim()}
                className="btn btn-primary"
              >
                {submitting ? 'Agregando...' : 'Agregar Avión'}
              </button>
            )}
          </div>
        </div>

        <div className="crud-table-card">
          <div className="table-header">
            <h2>Lista de Aviones</h2>
            <span className="record-count">{aviones.length} aviones registrados</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando aviones...</p>
            </div>
          ) : aviones.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✈️</span>
              <h3>No hay aviones registrados</h3>
              <p>Agrega el primer avión para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Modelo</th>
                    <th>Capacidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {aviones.map((avion) => (
                    <tr key={avion.avionID}>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">{avion.modelo}</span>
                        </div>
                      </td>
                      <td>
                        <span className="capacity-badge">{avion.capacidad}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(avion)}
                            className="btn btn-edit"
                            title="Editar avión"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(avion.avionID)}
                            className="btn btn-delete"
                            title="Eliminar avión"
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

export default AvionesCRUD;
