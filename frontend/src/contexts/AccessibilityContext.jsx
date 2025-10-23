import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [colorFilter, setColorFilter] = useState('default');

  // Aplicar filtro de color al documento raíz (html) para filtrar todo consistentemente
  useEffect(() => {
    const root = document.documentElement;
    // Remover filtros previos del html
    root.className = root.className.replace(/color-filter-\w+/g, '').trim();
    if (colorFilter !== 'default') {
      root.classList.add(`color-filter-${colorFilter}`);
    }
  }, [colorFilter]);

  // Manejar TTS
  useEffect(() => {
    const handleMouseEnter = (event) => {
      if (!ttsEnabled) return;

      const target = event.target;
      if (target && target.tagName && target.tagName.match(/^(P|H[1-6]|SPAN|DIV|A|LI|TD|TH)$/i) && target.textContent && target.textContent.trim()) {
        const utterance = new SpeechSynthesisUtterance(target.textContent.trim());
        utterance.lang = 'es-ES'; // Español de España, puedes cambiar a 'es-MX' si prefieres
        utterance.rate = 0.8; // Velocidad un poco más lenta para claridad
        utterance.pitch = 1;

        // Detener cualquier habla anterior
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    };

    if (ttsEnabled) {
      document.addEventListener('mouseenter', handleMouseEnter, true);
    } else {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      window.speechSynthesis.cancel(); // Detener habla si se desactiva
    }

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [ttsEnabled]);

  const value = {
    ttsEnabled,
    setTtsEnabled,
    colorFilter,
    setColorFilter,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
