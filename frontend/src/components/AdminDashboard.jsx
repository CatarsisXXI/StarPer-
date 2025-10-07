import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    aviones: 0,
    vuelos: 0,
    personal: 0,
    ciudades: 0,
    tripulaciones: 0
  });
  const [loading, setLoading] = useState(true);

  const getCount = (res) => {
  if (Array.isArray(res.data)) {
    return res.data.length; // caso normal (array)
  } else if (res.data?.$values && Array.isArray(res.data.$values)) {
    return res.data.$values.length; // caso cuando viene con $values
  } else if (res.data?.result && Array.isArray(res.data.result)) {
    return res.data.result.length; // caso { result: [...] }
  } else {
    return 0; // si no viene en un formato esperado
  }
};

 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          avionesRes,
          vuelosRes,
          personalRes,
          ciudadesRes,
          tripulacionesRes
        ] = await Promise.all([
          api.get('/Aviones'),
          api.get('/Vuelos'),
          api.get('/Personal'),
          api.get('/Ciudades'),
          api.get('/tripulacion-vuelo')

        ]);

        // Debug: ver qué llega del backend
        console.log("Aviones:", avionesRes.data);
        console.log("Vuelos:", vuelosRes.data);
        console.log("Personal:", personalRes.data);
        console.log("Ciudades:", ciudadesRes.data);
        console.log("Tripulaciones:", tripulacionesRes.data);

        setStats({
          aviones: getCount(avionesRes),
          vuelos: getCount(vuelosRes),
          personal: getCount(personalRes),
          ciudades: getCount(ciudadesRes),
          tripulaciones: getCount(tripulacionesRes)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="admin-nav-container">
          <div className="admin-nav-logo">
            <img
              src="https://vectorseek.com/wp-content/uploads/2023/09/Star-Peru-Logo-Vector.svg-.png"
              alt="Star Perú Logo"
              className="admin-logo-image"
            />
            <span className="admin-title">Panel de Administración</span>
          </div>

          <div className="admin-nav-user">
            <span className="admin-user-info">Admin: {user?.nombre}</span>
            <button onClick={handleLogout} className="admin-logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Dashboard de Star Perú</h1>
          <p>Resumen general del sistema</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon aviones">
                <span>✈️</span>
              </div>
              <div className="stat-content">
                <h3>{stats.aviones}</h3>
                <p>Aviones Registrados</p>
              </div>
              <Link to="/aviones" className="stat-link">Gestionar →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon vuelos">
                <span>🛫</span>
              </div>
              <div className="stat-content">
                <h3>{stats.vuelos}</h3>
                <p>Vuelos Programados</p>
              </div>
              <Link to="/vuelos" className="stat-link">Gestionar →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon personal">
                <span>👥</span>
              </div>
              <div className="stat-content">
                <h3>{stats.personal}</h3>
                <p>Personal Registrado</p>
              </div>
              <Link to="/personal" className="stat-link">Gestionar →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon ciudades">
                <span>🏙️</span>
              </div>
              <div className="stat-content">
                <h3>{stats.ciudades}</h3>
                <p>Ciudades Disponibles</p>
              </div>
              <Link to="/ciudades" className="stat-link">Gestionar →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon tripulaciones">
                <span>👨‍✈️</span>
              </div>
              <div className="stat-content">
                <h3>{stats.tripulaciones}</h3>
                <p>Tripulaciones Asignadas</p>
              </div>
              <Link to="/asignar-personal" className="stat-link">Gestionar →</Link>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <Link to="/aviones" className="action-card">
              <span className="action-icon">➕</span>
              <span>Agregar Avión</span>
            </Link>
            <Link to="/vuelos" className="action-card">
              <span className="action-icon">📅</span>
              <span>Programar Vuelo</span>
            </Link>
            <Link to="/personal" className="action-card">
              <span className="action-icon">👤</span>
              <span>Registrar Personal</span>
            </Link>
            <Link to="/ciudades" className="action-card">
              <span className="action-icon">🌍</span>
              <span>Agregar Ciudad</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
