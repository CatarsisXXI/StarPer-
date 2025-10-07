import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./ComprarBoleto.css";

const ComprarBoleto = () => {
  const { vueloId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { pasajeros } = location.state || {};

  const [vuelo, setVuelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState([]);

  // 🔹 Obtener vuelo por ID
  useEffect(() => {
    if (!vueloId) {
      setError("No se encontró información del vuelo.");
      setLoading(false);
      return;
    }

    const fetchVuelo = async () => {
      try {
        const response = await fetch(`http://localhost:5146/api/vuelos/${vueloId}`);
        if (!response.ok) throw new Error("Error al obtener datos del vuelo");
        const data = await response.json();
        setVuelo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVuelo();
  }, [vueloId]);

  // 🔹 Generar campos según número de pasajeros
  useEffect(() => {
    if (pasajeros) {
      const totalPasajeros =
        (pasajeros.adultos || 0) +
        (pasajeros.ninos || 0) +
        (pasajeros.bebes || 0);

      setFormData(
        Array.from({ length: totalPasajeros }, (_, i) => ({
          nombre: "",
          apellido: "",
          tipoDocumento: "DNI",
          numeroDocumento: "",
          edad: "",
          tipo:
            i < pasajeros.adultos
              ? "Adulto"
              : i < pasajeros.adultos + pasajeros.ninos
              ? "Niño"
              : "Bebé",
        }))
      );
    }
  }, [pasajeros]);

  const handleInputChange = (index, field, value) => {
    const newData = [...formData];
    newData[index][field] = value;
    setFormData(newData);
  };

  // 🔹 Generar boletos PDF
  const generarBoletosPDF = () => {
    const doc = new jsPDF();

    formData.forEach((p, index) => {
      if (index > 0) doc.addPage();

      doc.setFontSize(16);
      doc.text("STARPERU - Boleto de Pasajero", 20, 20);

      doc.setFontSize(12);
      doc.text(`Pasajero: ${p.nombre} ${p.apellido}`, 20, 40);
      doc.text(`Tipo documento: ${p.tipoDocumento}`, 20, 50);
      doc.text(`N° documento: ${p.numeroDocumento}`, 20, 60);
      doc.text(`Edad: ${p.edad}`, 20, 70);
      doc.text(`Tipo: ${p.tipo}`, 20, 80);

      doc.text("----- Detalles del vuelo -----", 20, 100);
      doc.text(`Origen: ${vuelo.Origen?.Nombre || "—"}`, 20, 110);
      doc.text(`Destino: ${vuelo.Destino?.Nombre || "—"}`, 20, 120);
      doc.text(
        `Fecha: ${new Date(vuelo.FechaHoraSalida).toLocaleDateString()}`,
        20,
        130
      );
      doc.text(
        `Hora salida: ${new Date(vuelo.FechaHoraSalida).toLocaleTimeString()}`,
        20,
        140
      );
      doc.text(
        `Hora llegada: ${new Date(vuelo.FechaHoraLlegada).toLocaleTimeString()}`,
        20,
        150
      );
      doc.text(`Precio: S/ ${vuelo.Precio || "—"}`, 20, 160);

      doc.text("----------------------------", 20, 180);
      doc.text("¡Gracias por volar con StarPeru!", 20, 190);
    });

    doc.save("Boletos_StarPeru.pdf");
  };

  if (loading) return <div className="loading">Cargando datos del vuelo...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!vuelo) return <div>No se encontró el vuelo.</div>;

  const precio = vuelo.Precio || 0;
  const total =
    precio *
    ((pasajeros?.adultos || 0) +
      (pasajeros?.ninos || 0) +
      (pasajeros?.bebes || 0));

  return (
    <div className="comprar-container">
      <h2 className="titulo-compra">✈️ Confirmar compra de boleto</h2>

      {/* 🔹 Detalles del vuelo */}
      <div className="card-vuelo">
        <h3>Detalles del vuelo</h3>
        <p>
          <strong>Origen:</strong> {vuelo.Origen?.Nombre || "—"}
        </p>
        <p>
          <strong>Destino:</strong> {vuelo.Destino?.Nombre || "—"}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(vuelo.FechaHoraSalida).toLocaleDateString("es-ES")}
        </p>
        <p>
          <strong>Hora salida:</strong>{" "}
          {new Date(vuelo.FechaHoraSalida).toLocaleTimeString("es-ES")}
        </p>
        <p>
          <strong>Hora llegada:</strong>{" "}
          {new Date(vuelo.FechaHoraLlegada).toLocaleTimeString("es-ES")}
        </p>
        <p>
          <strong>Precio por pasajero:</strong> S/ {precio}
        </p>
      </div>

      {/* 🔹 Formulario de pasajeros */}
      <div className="card-pasajeros">
        <h3>Datos de los pasajeros</h3>
        {formData.map((p, index) => (
          <div key={index} className="pasajero-form">
            <h4>
              Pasajero {index + 1} ({p.tipo})
            </h4>
            <div className="input-row">
              <input
                type="text"
                placeholder="Nombre"
                value={p.nombre}
                onChange={(e) =>
                  handleInputChange(index, "nombre", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={p.apellido}
                onChange={(e) =>
                  handleInputChange(index, "apellido", e.target.value)
                }
                required
              />
            </div>

            <div className="input-row">
              <select
                value={p.tipoDocumento}
                onChange={(e) =>
                  handleInputChange(index, "tipoDocumento", e.target.value)
                }
              >
                <option value="DNI">DNI</option>
                <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Otro">Otro</option>
              </select>

              <input
                type="text"
                placeholder="Número de documento"
                value={p.numeroDocumento}
                onChange={(e) =>
                  handleInputChange(index, "numeroDocumento", e.target.value)
                }
                required
              />
            </div>

            <div className="input-row">
              <input
                type="number"
                placeholder="Edad"
                value={p.edad}
                onChange={(e) => handleInputChange(index, "edad", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Total */}
      <div className="total-container">
        <h3>Total a pagar:</h3>
        <p className="precio-total">S/ {total.toFixed(2)}</p>
      </div>

      {/* 🔹 Acciones */}
      <div className="acciones">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <button
          className="btn-confirmar"
          onClick={generarBoletosPDF}
          disabled={formData.some(
            (p) => !p.nombre || !p.apellido || !p.numeroDocumento
          )}
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
};

export default ComprarBoleto;
