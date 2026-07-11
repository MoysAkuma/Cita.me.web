import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLogin } from '../hooks/Auth/useLogin';
import { useLogout } from '../hooks/Auth/useLogout';
import { useRegisterUser } from '../hooks/Auth/useRegisterUser';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  nombre: string;
  segundo_nombre?: string;
  apellido_paterno: string;
  apellido_materno?: string;
  acerca_de_mi?: string;
  correo: string;
  telefono?: string;
  telefono_whatsapp?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  profile_photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const loginHook = useLogin();
  const logoutHook = useLogout();
  const registerHook = useRegisterUser();

  // Verificar sesión existente al montar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = sessionStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const data = await loginHook.login(
        { correo : email, contraseña : password }
      );
      
      // Guardar la información del usuario desde la respuesta de la API
      if (data && data.user) {
        const userData: User = data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); // Redirigir al usuario a la página principal después del login
      }
    } catch (err: any) {
      setError(err.message || 'Error en el login');
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    await logoutHook.logout();
    
    if (logoutHook.error) {
      setError(logoutHook.error);
    }
    
    setUser(null);
  };

  const register = async (userData: any): Promise<void> => {
    setError(null);
    await registerHook.register(userData);
    
    if (registerHook.error) {
      setError(registerHook.error);
      throw new Error(registerHook.error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || loginHook.loading || logoutHook.loading || registerHook.loading,
    login,
    logout,
    register,
    updateUser,
    error: error || loginHook.error || logoutHook.error || registerHook.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
