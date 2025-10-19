import React from 'react';

const AccessibilityFilters = () => {
  return (
    <div className="accessibility-filters">
      <svg>
        <defs>
          {/* Protanopia - Ceguera al rojo */}
          <filter id="protanopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.567 0.433 0 0 0
                      0.558 0.442 0 0 0
                      0 0.242 0.758 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Protanomaly - Debilidad al rojo */}
          <filter id="protanomaly-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.817 0.183 0 0 0
                      0.333 0.667 0 0 0
                      0 0.125 0.875 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Deuteranopia - Ceguera al verde */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.625 0.375 0 0 0
                      0.7 0.3 0 0 0
                      0 0.3 0.7 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Deuteranomaly - Debilidad al verde */}
          <filter id="deuteranomaly-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.8 0.2 0 0 0
                      0.258 0.742 0 0 0
                      0 0.142 0.858 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Tritanopia - Ceguera al azul */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.95 0.05 0 0 0
                      0 0.433 0.567 0 0
                      0 0.475 0.525 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Tritanomaly - Debilidad al azul */}
          <filter id="tritanomaly-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.967 0.033 0 0 0
                      0 0.733 0.267 0 0
                      0 0.183 0.817 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AccessibilityFilters;
