import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./CRUD.css";

const VuelosCRUD = () => {
  const [vuelos, setVuelos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [form, setForm] = useState({
    vueloID: null,
    origenID: "",
    destinoID: "",
    avionID: "",
    fechaHoraSalida: "",
    fechaHoraLlegada: "",
    precio: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchVuelos(), fetchAviones(), fetchCiudades()]);
    setLoading(false);
  };

  const fetchVuelos = async () => {
    try {
      const res = await api.get("/Vuelos");
      const rawVuelos = res.data.$values || res.data;
      const cleanVuelos = rawVuelos.filter(v => v.vueloID);
      setVuelos(cleanVuelos);
    } catch (error) {
      console.error("Error fetching vuelos:", error);
    }
  };

  const fetchAviones = async () => {
    try {
      const res = await api.get("/Aviones");
      const data = res.data.$values || res.data;
      setAviones(data);
    } catch (error) {
      console.error("Error fetching aviones:", error);
    }
  };

  const fetchCiudades = async () => {
    try {
      const res = await api.get("/Ciudades");
      const data = res.data.$values || res.data;
      setCiudades(data);
    } catch (error) {
      console.error("Error fetching ciudades:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (["origenID", "destinoID", "avionID", "fechaHoraSalida"].includes(name)) {
      calcularFechaLlegada();
      calcularPrecio();
    }
  };

  const calcularFechaLlegada = () => {
    const origen = ciudades.find(c => c.ciudadID === parseInt(form.origenID));
    const destino = ciudades.find(c => c.ciudadID === parseInt(form.destinoID));
    if (form.fechaHoraSalida && origen && destino) {
      const salida = new Date(form.fechaHoraSalida);
      salida.setHours(salida.getHours() + parseFloat(destino.duracionEstimadahoras));
      setForm(prev => ({
        ...prev,
        fechaHoraLlegada: salida.toISOString().slice(0, 16),
      }));
    }
  };

  const calcularPrecio = () => {
    const destino = ciudades.find(c => c.ciudadID === parseInt(form.destinoID));
    const avion = aviones.find(a => a.avionID === parseInt(form.avionID));
    if (!destino || !avion) return;

    const factorBase = 100;
    const precio = (factorBase * parseFloat(destino.duracionEstimadahoras) * 150) / avion.capacidad;
    setForm(prev => ({ ...prev, precio: Math.round(precio) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (form.vueloID) {
        await api.put(`/Vuelos/${form.vueloID}`, form);
      } else {
        await api.post("/Vuelos", form);
      }
      clearForm();
      fetchVuelos();
    } catch (error) {
      console.error("Error saving vuelo:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vuelo) => {
    setForm({
      vueloID: vuelo.vueloID,
      origenID: vuelo.origenID,
      destinoID: vuelo.destinoID,
      avionID: vuelo.avionID,
      fechaHoraSalida: vuelo.fechaHoraSalida.slice(0, 16),
      fechaHoraLlegada: vuelo.fechaHoraLlegada.slice(0, 16),
      precio: vuelo.precio,
    });
  };

  const handleDelete = async (vueloID) => {
    if (!window.confirm("¿Deseas eliminar este vuelo?")) return;
    try {
      await api.delete(`/Vuelos/${vueloID}`);
      fetchVuelos();
    } catch (error) {
      console.error("Error deleting vuelo:", error);
    }
  };

  const clearForm = () => {
    setForm({
      vueloID: null,
      origenID: "",
      destinoID: "",
      avionID: "",
      fechaHoraSalida: "",
      fechaHoraLlegada: "",
      precio: "",
    });
  };

  const avionesDisponibles = aviones.filter(
    a => !vuelos.some(v => v.avionID === a.avionID && v.vueloID !== form.vueloID)
  );

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div className="crud-title-section">
          <div className="crud-icon">
            <span>✈️</span>
          </div>
          <div>
            <h1>Gestión de Vuelos</h1>
            <p>Administra los vuelos de Star Perú</p>
          </div>
        </div>
      </div>

      <div className="crud-content">
        {/* Formulario */}
        <div className="crud-form-card">
          <h2>{form.vueloID ? "Editar Vuelo" : "Agregar Nuevo Vuelo"}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Origen</label>
              <select
                name="origenID"
                value={form.origenID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione ciudad</option>
                {ciudades.map(c => (
                  <option key={`origen-${c.ciudadID}`} value={c.ciudadID}>
                    {c.nombre} ({c.codigoIATA})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destino</label>
              <select
                name="destinoID"
                value={form.destinoID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione ciudad</option>
                {ciudades
                  .filter(c => c.ciudadID.toString() !== form.origenID)
                  .map(c => (
                    <option key={`destino-${c.ciudadID}`} value={c.ciudadID}>
                      {c.nombre} ({c.codigoIATA})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Avión</label>
              <select
                name="avionID"
                value={form.avionID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione avión</option>
                {avionesDisponibles.map(a => (
                  <option key={`avion-${a.avionID}`} value={a.avionID}>
                    {a.modelo} ({a.capacidad} pax)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fecha y Hora Salida</label>
              <input
                type="datetime-local"
                name="fechaHoraSalida"
                value={form.fechaHoraSalida}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha y Hora Llegada</label>
              <input
                type="datetime-local"
                name="fechaHoraLlegada"
                value={form.fechaHoraLlegada}
                readOnly
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Precio (S/.)</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                readOnly
                className="form-input capacity-badge"
              />
            </div>
          </div>

          <div className="form-actions">
            {form.vueloID ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? "Actualizando..." : "Actualizar Vuelo"}
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
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Agregando..." : "Agregar Vuelo"}
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="crud-table-card">
          <div className="table-header">
            <h2>Lista de Vuelos</h2>
            <span className="record-count">{vuelos.length} vuelos registrados</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando vuelos...</p>
            </div>
          ) : vuelos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✈️</span>
              <h3>No hay vuelos registrados</h3>
              <p>Agrega el primer vuelo para comenzar</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Avión</th>
                    <th>Salida</th>
                    <th>Llegada</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
  {vuelos.map((v) => {
    const origenNombre = ciudades.find(c => c.ciudadID === v.origenID)?.nombre || "—";
    const destinoNombre = ciudades.find(c => c.ciudadID === v.destinoID)?.nombre || "—";
    const avionModelo = aviones.find(a => a.avionID === v.avionID)?.modelo || "—";

    return (
      <tr key={v.vueloID}>
        <td>
          <span className="capacity-badge">{origenNombre}</span>
        </td>
        <td>
          <span className="capacity-badge">{destinoNombre}</span>
        </td>
        <td>
          <span className="capacity-badge">{avionModelo}</span>
        </td>
        <td>
          <span className="capacity-badge">{new Date(v.fechaHoraSalida).toLocaleString()}</span>
        </td>
        <td>
          <span className="capacity-badge">{new Date(v.fechaHoraLlegada).toLocaleString()}</span>
        </td>
        <td>
          <span className="capacity-badge">S/ {v.precio}</span>
        </td>
        <td>
          <div className="action-buttons">
            <button
              onClick={() => handleEdit(v)}
              className="btn btn-edit"
              title="Editar vuelo"
            >
              ✏️ 
            </button>
            <button
              onClick={() => handleDelete(v.vueloID)}
              className="btn btn-delete"
              title="Eliminar vuelo"
            >
              🗑️ 
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VuelosCRUD;
