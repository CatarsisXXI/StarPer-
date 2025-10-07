import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CRUD.css';

const PersonalCRUD = () => {
  const [personal, setPersonal] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [puesto, setPuesto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Personal');
      const data = response.data;
      // Manejar caso donde venga $values
      const listaPersonal = Array.isArray(data) ? data : data?.$values || [];
      setPersonal(listaPersonal);
      console.log('Respuesta API Personal:', listaPersonal);
    } catch (error) {
      console.error('Error fetching personal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!nombre.trim() || !apellido.trim() || !puesto.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/Personal', {
        Nombre: nombre.trim(),
        Apellido: apellido.trim(),
        Puesto: puesto.trim(),
      });
      clearForm();
      fetchPersonal();
    } catch (error) {
      console.error('Error adding personal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (persona) => {
    setEditingId(persona.PersonalID);
    setNombre(persona.Nombre);
    setApellido(persona.Apellido);
    setPuesto(persona.Puesto);
  };

  const handleUpdate = async () => {
    if (!nombre.trim() || !apellido.trim() || !puesto.trim()) return;

    try {
      setSubmitting(true);
      await api.put(`/Personal/${editingId}`, {
        Nombre: nombre.trim(),
        Apellido: apellido.trim(),
        Puesto: puesto.trim(),
      });
      clearForm();
      fetchPersonal();
    } catch (error) {
      console.error('Error updating personal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este miembro del personal?')) return;

    try {
      await api.delete(`/Personal/${id}`);
      fetchPersonal();
    } catch (error) {
      console.error('Error deleting personal:', error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setNombre('');
    setApellido('');
    setPuesto('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon">
            <span>👥</span>
          </div>
          <div>
            <h1>Gestión de Personal</h1>
            <p>Administra el personal de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        <div className="crud-form-card">
          <h2>{editingId ? 'Editar Miembro del Personal' : 'Agregar Nuevo Personal'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                placeholder="Ej: Pérez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="puesto">Puesto</label>
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
                  disabled={submitting || !nombre.trim() || !apellido.trim() || !puesto.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Actualizando...' : 'Actualizar Personal'}
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
                disabled={submitting || !nombre.trim() || !apellido.trim() || !puesto.trim()}
                className="btn btn-primary"
              >
                {submitting ? 'Agregando...' : 'Agregar Personal'}
              </button>
            )}
          </div>
        </div>

        <div className="crud-table-card">
          <div className="table-header">
            <h2>Lista de Personal</h2>
            <span className="record-count">{personal.length} miembros registrados</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando personal...</p>
            </div>
          ) : personal.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <h3>No hay personal registrado</h3>
              <p>Agrega el primer miembro del personal para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Puesto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {personal.map((persona) => (
                    <tr key={persona.PersonalID}>
                      <td className="model-cell">
                        <div className="model-info">
                          <span className="model-name">{persona.Nombre} {persona.Apellido}</span>
                        </div>
                      </td>
                      <td>
                        <span className="capacity-badge">{persona.Puesto}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(persona)}
                            className="btn btn-edit"
                            title="Editar personal"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(persona.PersonalID)}
                            className="btn btn-delete"
                            title="Eliminar personal"
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

export default PersonalCRUD;
