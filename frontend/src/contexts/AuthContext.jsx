import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5146/api/auth/login', {
      email,
      password
    });

    console.log('Login response:', response.data); // Debug log

    const responseData = response.data;
    const token = responseData.Token || responseData.token;
    const success = responseData.Success || responseData.success;

    if (!success || !responseData.User) {
      console.error('Invalid response structure:', responseData);
      return {
        success: false,
        error: 'Respuesta del servidor inválida'
      };
    }

    // Normalizamos los campos de usuario para evitar errores de mayúsculas/minúsculas
    const rawUser = responseData.User || responseData.user;

    const userData = {
    ...rawUser,
    role: rawUser?.Role || rawUser?.role || '',  // convierte Role → role
    email: rawUser?.Email || rawUser?.email || ''
};

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data || 'Error al iniciar sesión'
    };
  }
};

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5146/api/auth/register', userData);

      const { Token: token, User: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrarse'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAdmin = () => {
  return user && user.role === 'Admin';
};


  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
