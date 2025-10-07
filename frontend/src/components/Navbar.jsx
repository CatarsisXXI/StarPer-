import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/destinos');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/destinos" className="nav-logo" onClick={closeMobileMenu}>
          <div className="logo-container">
            <img
              src="https://vectorseek.com/wp-content/uploads/2023/09/Star-Peru-Logo-Vector.svg-.png"
              alt="Star Perú Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="brand-name">Star Perú</span>
              <span className="brand-tagline">La aerolínea de los peruanos</span>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          {user ? (
            isAdmin() ? (
              <>
                <Link
                  to="/admin"
                  className={`nav-link ${isActiveLink('/admin') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <div className="nav-dropdown">
                  <button className="nav-dropdown-toggle">
                    Gestión
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  <div className="nav-dropdown-menu">
                    <Link to="/aviones" className="dropdown-item">Aviones</Link>
                    <Link to="/vuelos" className="dropdown-item">Vuelos</Link>
                    <Link to="/personal" className="dropdown-item">Personal</Link>
                    <Link to="/ciudades" className="dropdown-item">Ciudades</Link>
                    <Link to="/asignar-personal" className="dropdown-item">Asignar Personal</Link>
                  </div>
                </div>
                <div className="user-section">
                  <span className="user-greeting">Hola, {user.nombre}</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/destinos"
                  className={`nav-link ${isActiveLink('/destinos') ? 'active' : ''}`}
                >
                  Destinos
                </Link>
                <Link
                  to="/buscar-vuelos"
                  className={`nav-link ${isActiveLink('/buscar-vuelos') ? 'active' : ''}`}
                >
                  Buscar Vuelos
                </Link>
                <div className="user-section">
                  <span className="user-greeting">Hola, {user.nombre}</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )
          ) : (
            <>
              <Link
                to="/destinos"
                className={`nav-link ${isActiveLink('/destinos') ? 'active' : ''}`}
              >
                Destinos
              </Link>
              <Link
                to="/buscar-vuelos"
                className={`nav-link ${isActiveLink('/buscar-vuelos') ? 'active' : ''}`}
              >
                Buscar Vuelos
              </Link>
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        {user ? (
          isAdmin() ? (
            <>
              <Link to="/admin" className="mobile-nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <div className="mobile-nav-section">
                <h4>Gestión</h4>     
              <Link to="/aviones" className="mobile-nav-link" onClick={closeMobileMenu}>Aviones</Link>
              <Link to="/vuelos" className="mobile-nav-link" onClick={closeMobileMenu}>Vuelos</Link>
              <Link to="/personal" className="mobile-nav-link" onClick={closeMobileMenu}>Personal</Link>
              <Link to="/ciudades" className="mobile-nav-link" onClick={closeMobileMenu}>Ciudades</Link>
              <Link to="/asignar-personal" className="mobile-nav-link" onClick={closeMobileMenu}>Asignar Personal</Link>
              </div>
              <div className="mobile-user-section">
                <span className="mobile-user-greeting">Hola, {user.nombre}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/destinos" className="mobile-nav-link" onClick={closeMobileMenu}>
                Destinos
              </Link>
              <Link to="/buscar-vuelos" className="mobile-nav-link" onClick={closeMobileMenu}>
                Buscar Vuelos
              </Link>
              <div className="mobile-user-section">
                <span className="mobile-user-greeting">Hola, {user.nombre}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Cerrar Sesión
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <Link to="/destinos" className="mobile-nav-link" onClick={closeMobileMenu}>
              Destinos
            </Link>
            <Link to="/buscar-vuelos" className="mobile-nav-link" onClick={closeMobileMenu}>
              Buscar Vuelos
            </Link>
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                Registrarse
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;