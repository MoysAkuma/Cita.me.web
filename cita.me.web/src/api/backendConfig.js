import axios from 'axios';

// 1. Obtener la URL base desde las variables de entorno.
// Si usas Vite es: import.meta.env.VITE_API_URL
// Si usas Create React App (antiguo) es: process.env.REACT_APP_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// 2. Crear la instancia personalizada de Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Corta la petición si el servidor tarda más de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 3. INTERCEPTOR DE PETICIÓN (Request)
// Se ejecuta ANTES de que la petición salga hacia el backend.
// Ideal para inyectar tokens JWT de forma automática.
api.interceptors.request.use(
  (config) => {
    // Buscamos el token en el almacenamiento local (o donde lo guardes)
    const token = localStorage.getItem('token'); 
    
    if (token) {
      // Si existe el token, lo añadimos a las cabeceras de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Manejo de errores que ocurran antes de enviar la petición
    return Promise.reject(error);
  }
);

// 4. INTERCEPTOR DE RESPUESTA (Response)
// Se ejecuta CUANDO LA RESPUESTA LLEGA del servidor, antes de pasársela a tus hooks.
// Ideal para capturar errores globales (como sesiones expiradas).
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (status 2xx), la dejamos pasar tal cual
    return response;
  },
  (error) => {
    // Si el servidor responde con un código de error (4xx, 5xx)
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Ejemplo: El token expiró o es inválido. 
        // Aquí puedes borrar el token obsoleto y redirigir al login.
        console.warn('Sesión expirada o no autorizada. Limpiando datos...');
        localStorage.removeItem('token');
        
        // Opcional: Redirigir al usuario (dependiendo de cómo manejes tus rutas)
        // window.location.href = '/login';
      }

      if (status === 500) {
        console.error('Error interno del servidor. Inténtalo más tarde.');
      }
    } else if (error.request) {
      // La petición se hizo pero el servidor nunca respondió (error de red)
      console.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }

    // Retornamos el error para que el hook o componente también pueda capturarlo si lo desea
    return Promise.reject(error);
  }
);