import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Destinos.css';

const Destinos = () => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get('http://localhost:5146/api/ciudades');
        setCiudades(response.data);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
        setError('Error al cargar los destinos');
      } finally {
        setLoading(false);
      }
    };

    fetchCiudades();
  }, []);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Función para obtener la clase CSS de imagen de ciudad
  const getCiudadImageClass = (ciudadNombre) => {
    const imageMap = {
      'Lima': 'ciudad-lima',
      'Cusco': 'ciudad-cusco',
      'Arequipa': 'ciudad-arequipa',
      'Trujillo': 'ciudad-trujillo',
      'Iquitos': 'ciudad-iquitos',
      'Cajamarca': 'ciudad-cajamarca'
    };
    return imageMap[ciudadNombre] || 'ciudad-lima';
  };

  // Función para obtener características de cada ciudad
  const getCiudadFeatures = (ciudadNombre) => {
    const featuresMap = {
      'Lima': ['Costa', 'Capital', 'Moderno'],
      'Cusco': ['Sierra', 'Histórico', 'Cultural'],
      'Arequipa': ['Volcán', 'Colonial', 'Gastronomía'],
      'Trujillo': ['Arqueología', 'Colonial', 'Playas'],
      'Iquitos': ['Selva', 'Río Amazonas', 'Biodiversidad'],
      'Cajamarca': ['Historia', 'Baños termales', 'Carnavales']
    };
    return featuresMap[ciudadNombre] || ['Destino', 'Peruano'];
  };

  if (loading) {
    return (
      <div className="destinos-container">
        {/* Aviones decorativos */}
        <div className="plane-decoration plane-1">✈️</div>
        <div className="plane-decoration plane-2">✈️</div>
        <div className="plane-decoration plane-3">✈️</div>
        <div className="plane-decoration plane-4">✈️</div>

        <div className="hero-section">
          <div className="hero-carousel">
            <div className={`hero-slide slide-1 ${currentSlide === 0 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-2 ${currentSlide === 1 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-3 ${currentSlide === 2 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-4 ${currentSlide === 3 ? 'active' : ''}`}></div>
          </div>

          <div className="hero-content">
            <h1>Descubre Perú con Star Perú</h1>
            <p>Conecta con los destinos más fascinantes de nuestro país</p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg">Buscar Vuelos</button>
              <button className="btn btn-outline btn-lg">Conoce Más</button>
            </div>
          </div>

          <div className="hero-carousel-indicators">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando destinos maravillosos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinos-container">
        {/* Aviones decorativos */}
        <div className="plane-decoration plane-1">✈️</div>
        <div className="plane-decoration plane-2">✈️</div>
        <div className="plane-decoration plane-3">✈️</div>
        <div className="plane-decoration plane-4">✈️</div>

        <div className="hero-section">
          <div className="hero-carousel">
            <div className={`hero-slide slide-1 ${currentSlide === 0 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-2 ${currentSlide === 1 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-3 ${currentSlide === 2 ? 'active' : ''}`}></div>
            <div className={`hero-slide slide-4 ${currentSlide === 3 ? 'active' : ''}`}></div>
          </div>

          <div className="hero-content">
            <h1>Descubre Perú con Star Perú</h1>
            <p>Conecta con los destinos más fascinantes de nuestro país</p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg">Buscar Vuelos</button>
              <button className="btn btn-outline btn-lg">Conoce Más</button>
            </div>
          </div>

          <div className="hero-carousel-indicators">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Oops! Algo salió mal</h2>
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="destinos-container">
      {/* Aviones decorativos */}
      <div className="plane-decoration plane-1">✈️</div>
      <div className="plane-decoration plane-2">✈️</div>
      <div className="plane-decoration plane-3">✈️</div>
      <div className="plane-decoration plane-4">✈️</div>

      {/* Hero Section con Carrusel */}
      <div className="hero-section">
        <div className="hero-carousel">
          <div className={`hero-slide slide-1 ${currentSlide === 0 ? 'active' : ''}`}></div>
          <div className={`hero-slide slide-2 ${currentSlide === 1 ? 'active' : ''}`}></div>
          <div className={`hero-slide slide-3 ${currentSlide === 2 ? 'active' : ''}`}></div>
          <div className={`hero-slide slide-4 ${currentSlide === 3 ? 'active' : ''}`}></div>
        </div>

        <div className="hero-content">
          <h1>Descubre Perú con Star Perú</h1>
          <p>Conecta con los destinos más fascinantes de nuestro país</p>
          <div className="hero-buttons">
            <a href="/buscar-vuelos" className="btn btn-primary btn-lg">Buscar Vuelos</a>
            <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}>Conoce Más</button>
          </div>
        </div>

        <div className="hero-carousel-indicators">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2>Sobre Star Perú</h2>
            <div className="about-divider"></div>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3>La Aerolínea de los Peruanos</h3>
              <p>
                Star Perú es la aerolínea bandera del Perú, comprometida con conectar a nuestros compatriotas
                con los destinos más fascinantes de nuestro hermoso país. Desde las playas del norte hasta
                las alturas de los Andes, y desde la selva amazónica hasta la costa pacífica, estamos aquí
                para hacer que tus viajes sean inolvidables.
              </p>

              <p>
                Fundada con la visión de promover el turismo interno y facilitar la movilidad de los peruanos,
                Star Perú se ha convertido en sinónimo de calidad, seguridad y servicio excepcional. Nuestro
                compromiso va más allá del transporte aéreo; somos embajadores culturales que conectamos
                comunidades y preservamos las tradiciones de nuestro pueblo.
              </p>

              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Destinos Nacionales</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Vuelos Diarios</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Pasajeros Anuales</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">25</span>
                  <span className="stat-label">Años de Experiencia</span>
                </div>
              </div>
            </div>

            <div className="about-image">
              <div className="about-image-placeholder">
                <span className="plane-icon">✈️</span>
                <p>Tu viaje comienza aquí</p>
              </div>
            </div>
          </div>

          <div className="about-features">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Seguridad Primero</h4>
              <p>Los más altos estándares de seguridad certificados internacionalmente</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💺</div>
              <h4>Comodidad Premium</h4>
              <p>Asientos ergonómicos y servicio personalizado para tu confort</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌎</div>
              <h4>Compromiso Ambiental</h4>
              <p>Trabajamos por un turismo sostenible y respetuoso con nuestro planeta</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h4>Orgullo Peruano</h4>
              <p>Celebramos y promovemos la rica diversidad cultural de nuestro país</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <span className="info-card-icon">✈️</span>
            <h3>Vuelos Directos</h3>
            <p>Conexiones rápidas y cómodas entre las principales ciudades del Perú</p>
          </div>
          <div className="info-card">
            <span className="info-card-icon">🛡️</span>
            <h3>Seguridad Garantizada</h3>
            <p>Los más altos estándares de seguridad en todos nuestros vuelos</p>
          </div>
          <div className="info-card">
            <span className="info-card-icon">💺</span>
            <h3>Comodidad Premium</h3>
            <p>Experimenta el confort de volar con la aerolínea de los peruanos</p>
          </div>
        </div>
      </div>

      {/* Destinos Section */}
      <div className="destinos-section">
        <h2>Nuestros Destinos</h2>
        <div className="ciudades-grid">
          {Array.isArray(ciudades) && ciudades.map(ciudad => (
            <div key={ciudad.CiudadID} className="ciudad-card">
              <div className={`ciudad-image ${getCiudadImageClass(ciudad.Nombre)}`}></div>
              <div className="ciudad-card-body">
                <div className="ciudad-header">
                  <h3>{ciudad.Nombre}</h3>
                  <span className="codigo-iata">{ciudad.CodigoIATA}</span>
                </div>

                <div className="ciudad-features">
                  {getCiudadFeatures(ciudad.Nombre).map((feature, index) => (
                    <span key={index} className="ciudad-feature">{feature}</span>
                  ))}
                </div>

                <p className="ciudad-description">
                  Descubre todo lo que {ciudad.Nombre} tiene para ofrecerte. Una experiencia única te espera.
                </p>

                <button
                  className="reservar-button"
                  onClick={() => navigate('/buscar-vuelos', { state: { destinoSeleccionado: ciudad.CiudadID } })}
                >
                  Buscar Vuelos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinos;
