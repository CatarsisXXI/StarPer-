import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        color: '#1a365d'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #fbbf24',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Cargando...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        color: '#1a365d',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          color: '#dc2626'
        }}>🚫</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Acceso Denegado</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px', maxWidth: '500px' }}>
          No tienes permisos para acceder a esta sección. Esta área está reservada únicamente para administradores.
        </p>
        <a
          href="/destinos"
          style={{
            background: '#1a365d',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          ← Volver al inicio
        </a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
