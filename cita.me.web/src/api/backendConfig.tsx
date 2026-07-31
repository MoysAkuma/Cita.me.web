import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import endpoints from '../config/endpoints.json';

// 1. Obtener la URL base desde las variables de entorno.
// Si usas Vite es: import.meta.env.VITE_API_URL
// Si usas Create React App (antiguo) es: process.env.REACT_APP_API_URL
const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// 2. Crear la instancia personalizada de Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Corta la petición si el servidor tarda más de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Cliente sin interceptores para evitar ciclos al renovar el token.
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const flushPendingRequests = (error: unknown, token: string | null): void => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
      return;
    }

    reject(error);
  });
  pendingRequests = [];
};

const clearSession = (): void => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:session-expired'));
  }
};

const isAuthRoute = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return [endpoints.auth.login, endpoints.auth.register, endpoints.auth.refresh].some((route) =>
    url.includes(route)
  );
};

// 3. INTERCEPTOR DE PETICIÓN (Request)
// Se ejecuta ANTES de que la petición salga hacia el backend.
// Ideal para inyectar tokens JWT de forma automática.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Buscamos el token en sessionStorage (donde se guarda después del login/registro)
    const token = sessionStorage.getItem('accessToken'); 
    
    if (token && config.headers) {
      // Si existe el token, lo añadimos a las cabeceras de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Manejo de errores que ocurran antes de enviar la petición
    return Promise.reject(error);
  }
);

// 4. INTERCEPTOR DE RESPUESTA (Response)
// Se ejecuta CUANDO LA RESPUESTA LLEGA del servidor, antes de pasársela a tus hooks.
// Ideal para capturar errores globales (como sesiones expiradas).
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Si la respuesta es exitosa (status 2xx), la dejamos pasar tal cual
    return response;
  },
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute(originalRequest.url)
    ) {
      const storedRefreshToken = sessionStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        clearSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshApi.post(endpoints.auth.refresh, {
          refreshToken: storedRefreshToken,
        });
        const newAccessToken = refreshResponse.data?.data?.accessToken as string | undefined;

        if (!newAccessToken) {
          throw new Error('No access token returned by refresh endpoint');
        }

        sessionStorage.setItem('accessToken', newAccessToken);
        flushPendingRequests(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        flushPendingRequests(refreshError, null);
        clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 500) {
      console.error('Error interno del servidor. Inténtalo más tarde.');
    }

    if (error.request) {
      // La petición se hizo pero el servidor nunca respondió (error de red)
      console.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }

    // Retornamos el error para que el hook o componente también pueda capturarlo si lo desea
    return Promise.reject(error);
  }
);