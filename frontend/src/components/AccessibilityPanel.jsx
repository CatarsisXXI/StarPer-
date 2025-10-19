import React, { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './AccessibilityPanel.css';

const AccessibilityPanel = () => {
  const { ttsEnabled, setTtsEnabled, colorFilter, setColorFilter } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const colorFilters = [
    { value: 'default', label: 'Por defecto', description: 'Sin filtro de color' },
    { value: 'protanopia', label: 'Protanopía', description: 'Simula ceguera al color rojo' },
    { value: 'protanomaly', label: 'Protanomalía', description: 'Simula debilidad al color rojo' },
    { value: 'deuteranopia', label: 'Deuteranopía', description: 'Simula ceguera al color verde' },
    { value: 'deuteranomaly', label: 'Deuteranomalía', description: 'Simula debilidad al color verde' },
    { value: 'tritanopia', label: 'Tritanopía', description: 'Simula ceguera al color azul' },
    { value: 'tritanomaly', label: 'Tritanomalía', description: 'Simula debilidad al color azul' },
    { value: 'achromatopsia', label: 'Acromatopsia', description: 'Simula monocromatismo (escala de grises)' },
  ];

  return (
    <>
      {/* Botón flotante para abrir/cerrar el panel */}
      <button
        className={`accessibility-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Panel de accesibilidad"
        title="Accesibilidad"
      >
        ♿
      </button>

      {/* Panel de accesibilidad */}
      <div className={`accessibility-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h3>Accesibilidad</h3>
          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar panel"
          >
            ×
          </button>
        </div>

        <div className="panel-content">
          {/* Texto por voz */}
          <div className="accessibility-section">
            <h4>Texto por Voz</h4>
            <p className="section-description">
              Activa el lector de texto asistido. Pasa el mouse sobre elementos de texto para escuchar su contenido.
            </p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={(e) => setTtsEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Filtro de daltonismo */}
          <div className="accessibility-section">
            <h4>Filtro de Daltonismo</h4>
            <p className="section-description">
              Selecciona un filtro para simular diferentes tipos de daltonismo.
            </p>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="filter-select"
            >
              {colorFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <p className="filter-description">
              {colorFilters.find(f => f.value === colorFilter)?.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityPanel;
