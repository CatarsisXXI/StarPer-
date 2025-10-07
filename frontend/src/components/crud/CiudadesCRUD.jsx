import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const CiudadesCRUD = () => {
  const [ciudades, setCiudades] = useState([]);
  const [nombre, setNombre] = useState('');
  const [codigoIATA, setCodigoIATA] = useState('');
  const [duracionHoras, setDuracionHoras] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCiudades();
  }, []);

  const fetchCiudades = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Ciudades');
      console.log('Respuesta API Ciudades:', response.data);
      const data = Array.isArray(response.data) ? response.data : response.data?.$values || [];
      setCiudades(data);
    } catch (error) {
      console.error('Error fetching ciudades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!nombre.trim() || !codigoIATA.trim() || !duracionHoras.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/Ciudades', {
        Nombre: nombre.trim(),
        CodigoIATA: codigoIATA.trim(),
        DuracionEstimadahoras: parseInt(duracionHoras),
      });
      clearForm();
      fetchCiudades();
    } catch (error) {
      console.error('Error adding ciudad:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ciudad) => {
    setEditingId(ciudad.CiudadID);
    setNombre(ciudad.Nombre);
    setCodigoIATA(ciudad.CodigoIATA || '');
    setDuracionHoras(ciudad.DuracionEstimadahoras?.toString() || '');
  };

  const handleUpdate = async () => {
    if (!nombre.trim() || !codigoIATA.trim() || !duracionHoras.trim()) return;

    try {
      setSubmitting(true);
      await api.put(`/Ciudades/${editingId}`, {
        Nombre: nombre.trim(),
        CodigoIATA: codigoIATA.trim(),
        DuracionEstimadahoras: parseInt(duracionHoras),
      });
      clearForm();
      fetchCiudades();
    } catch (error) {
      console.error('Error updating ciudad:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta ciudad?')) return;

    try {
      await api.delete(`/Ciudades/${id}`);
      fetchCiudades();
    } catch (error) {
      console.error('Error deleting ciudad:', error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setNombre('');
    setDuracionHoras('');
    setCodigoIATA('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon">
            <span>🏙️</span>
          </div>
          <div>
            <h1>Gestión de Ciudades</h1>
            <p>Administra las ciudades de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        <div className="crud-form-card">
          <h2>{editingId ? 'Editar Ciudad' : 'Agregar Nueva Ciudad'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Lima"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="codigoIATA">Código IATA</label>
              <input
                id="codigoIATA"
                type="text"
                placeholder="Ej: LIM"
                value={codigoIATA}
                onChange={(e) => setCodigoIATA(e.target.value)}
                className="form-input"
                maxLength={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="duracionHoras">Duración Estimada (horas)</label>
              <input
                id="duracionHoras"
                type="number"
                placeholder="Ej: 2"
                value={duracionHoras}
                onChange={(e) => setDuracionHoras(e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
          </div>
          <div className="form-actions">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={submitting || !nombre.trim() || !codigoIATA.trim() || !duracionHoras.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Actualizando...' : 'Actualizar Ciudad'}
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
                disabled={submitting || !nombre.trim() || !codigoIATA.trim() || !duracionHoras.trim()}
                className="btn btn-primary"
              >
                {submitting ? 'Agregando...' : 'Agregar Ciudad'}
              </button>
            )}
          </div>
        </div>

        <div className="crud-table-card">
          <div className="table-header">
            <h2>Lista de Ciudades</h2>
            <span className="record-count">{ciudades.length} ciudades registradas</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando ciudades...</p>
            </div>
          ) : ciudades.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🏙️</span>
              <h3>No hay ciudades registradas</h3>
              <p>Agrega la primera ciudad para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código IATA</th>
                    <th>Duración Estimada (horas)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ciudades.map((ciudad) => (
                    <tr key={ciudad.CiudadID}>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">{ciudad.Nombre}</span>
                        </div>
                      </td>
                      <td>
                        <span className="capacity-badge">{ciudad.CodigoIATA}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">{ciudad.DuracionEstimadahoras} horas</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(ciudad)}
                            className="btn btn-edit"
                            title="Editar ciudad"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(ciudad.CiudadID)}
                            className="btn btn-delete"
                            title="Eliminar ciudad"
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

export default CiudadesCRUD;
