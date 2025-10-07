import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./CRUD.css";

const VuelosCRUD = () => {
  const [vuelos, setVuelos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [form, setForm] = useState({
    VueloID: null,
    OrigenID: "",
    DestinoID: "",
    AvionID: "",
    FechaHoraSalida: "",
    FechaHoraLlegada: "",
    Precio: "",
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
      const cleanVuelos = rawVuelos.filter(v => v.VueloID != null);
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

    if (["OrigenID", "DestinoID", "AvionID", "FechaHoraSalida"].includes(name)) {
      calcularFechaLlegada();
      calcularPrecio();
    }
  };

  const calcularFechaLlegada = () => {
  const origen = ciudades.find(c => c?.CiudadID === parseInt(form.OrigenID));
  const destino = ciudades.find(c => c?.CiudadID === parseInt(form.DestinoID));
  if (form.FechaHoraSalida && origen && destino) {
    const salida = new Date(form.FechaHoraSalida);
    salida.setHours(salida.getHours() + parseFloat(destino?.DuracionEstimadahoras || 0));
    
    const yyyy = salida.getFullYear();
    const mm = String(salida.getMonth() + 1).padStart(2, '0');
    const dd = String(salida.getDate()).padStart(2, '0');
    const hh = String(salida.getHours()).padStart(2, '0');
    const min = String(salida.getMinutes()).padStart(2, '0');

    const llegadaLocal = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

    setForm(prev => ({
      ...prev,
      FechaHoraLlegada: llegadaLocal,
    }));
  }
};
    
  const calcularPrecio = () => {
    const destino = ciudades.find(c => c?.CiudadID === parseInt(form.DestinoID));
    const avion = aviones.find(a => a?.AvionID === parseInt(form.AvionID));
    if (!destino || !avion || !avion.Capacidad) return;

    const factorBase = 100;
    const precio = (factorBase * parseFloat(destino?.DuracionEstimadahoras || 0) * 150) / avion.Capacidad;
    setForm(prev => ({ ...prev, Precio: Math.round(precio) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (form.VueloID) {
        await api.put(`/Vuelos/${form.VueloID}`, form);
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
      VueloID: vuelo.VueloID,
      OrigenID: vuelo.OrigenID,
      DestinoID: vuelo.DestinoID,
      AvionID: vuelo.AvionID,
      FechaHoraSalida: vuelo.FechaHoraSalida?.slice(0, 16) || "",
      FechaHoraLlegada: vuelo.FechaHoraLlegada?.slice(0, 16) || "",
      Precio: vuelo.Precio || "",
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
      VueloID: null,
      OrigenID: "",
      DestinoID: "",
      AvionID: "",
      FechaHoraSalida: "",
      FechaHoraLlegada: "",
      Precio: "",
    });
  };

  const avionesDisponibles = aviones.filter(
    a => !vuelos.some(v => v.AvionID === a.AvionID && v.VueloID !== form.VueloID)
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
          <h2>{form.VueloID ? "Editar Vuelo" : "Agregar Nuevo Vuelo"}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Origen</label>
              <select
                name="OrigenID"
                value={form.OrigenID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione ciudad</option>
                {ciudades.map((c) => (
                  <option key={`origen-${c?.CiudadID}`} value={c?.CiudadID}>
                    {c?.Nombre} ({c?.CodigoIATA})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destino</label>
              <select
                name="DestinoID"
                value={form.DestinoID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione ciudad</option>
                {ciudades
                  .filter(c => c?.CiudadID?.toString() !== form.OrigenID)
                  .map((c) => (
                    <option key={`destino-${c?.CiudadID}`} value={c?.CiudadID}>
                      {c?.Nombre} ({c?.CodigoIATA})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Avión</label>
              <select
                name="AvionID"
                value={form.AvionID}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccione avión</option>
                {avionesDisponibles.map((a) => (
                  <option key={`avion-${a?.AvionID}`} value={a?.AvionID}>
                    {a?.Modelo} ({a?.Capacidad} pax)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fecha y Hora Salida</label>
              <input
                type="datetime-local"
                name="FechaHoraSalida"
                value={form.FechaHoraSalida}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha y Hora Llegada</label>
              <input
                type="datetime-local"
                name="FechaHoraLlegada"
                value={form.FechaHoraLlegada}
                readOnly
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Precio (S/.)</label>
              <input
                type="number"
                name="Precio"
                value={form.Precio}
                readOnly
                className="form-input capacity-badge"
              />
            </div>
          </div>

          <div className="form-actions">
            {form.VueloID ? (
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
                  {vuelos.map((v) => (
                    <tr key={v.VueloID}>
                      <td>
                        <span className="capacity-badge">{ciudades.find(c => c?.CiudadID === v.OrigenID)?.Nombre ?? "—"}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">{ciudades.find(c => c?.CiudadID === v.DestinoID)?.Nombre ?? "—"}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">{aviones.find(a => a?.AvionID === v.AvionID)?.Modelo ?? "—"}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">{new Date(v.FechaHoraSalida).toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">{new Date(v.FechaHoraLlegada).toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="capacity-badge">S/ {v.Precio}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(v)} className="btn btn-edit" title="Editar vuelo">✏️</button>
                          <button onClick={() => handleDelete(v.VueloID)} className="btn btn-delete" title="Eliminar vuelo">🗑️</button>
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

export default VuelosCRUD;
