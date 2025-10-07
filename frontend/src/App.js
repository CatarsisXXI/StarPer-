import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Destinos from './components/Destinos';
import BusquedaVuelos from './components/BusquedaVuelos';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import AvionesCRUD from './components/crud/AvionesCRUD';
import VuelosCRUD from './components/crud/VuelosCRUD';
import PersonalCRUD from './components/crud/PersonalCRUD';
import CiudadesCRUD from './components/crud/CiudadesCRUD';
import AsignarPersonalCRUD from './components/crud/AsignarPersonalCRUD';
import ComprarBoleto from './components/ComprarBoleto';
 import './App.css';
 
 function App() {
   return (

    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/destinos" />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/buscar-vuelos" element={
            <PrivateRoute>
              <BusquedaVuelos />
            </PrivateRoute>
          } />
          <Route path="/comprar/:vueloId" element={
            <PrivateRoute>
              <ComprarBoleto />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/aviones" element={
            <AdminRoute>
              <AvionesCRUD />
            </AdminRoute>
          } />
          <Route path="/vuelos" element={
            <AdminRoute>
              <VuelosCRUD />
            </AdminRoute>
          } />
          <Route path="/personal" element={
            <AdminRoute>
              <PersonalCRUD />
            </AdminRoute>
          } />
          <Route path="/ciudades" element={
            <AdminRoute>
              <CiudadesCRUD />
            </AdminRoute>
          } />
          <Route path="/asignar-personal" element={
            <AdminRoute>
              <AsignarPersonalCRUD />
            </AdminRoute>
          } />
          <Route path="*" element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '70vh',
              textAlign: 'center',
              color: '#1a365d'
            }}>
              <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>404</h1>
              <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Página no encontrada</h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                La página que buscas no existe o ha sido movida.
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
          } />
        </Routes>
      </Router>
    </AuthProvider>
   );
 }
export default App;