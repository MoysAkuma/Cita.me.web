import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Profile from './Pages/Profile';
import RequestAppointment from './Pages/RequestAppointment';
import Appointments from './Pages/Appointments';
import Login from './Pages/Login';
import ProviderOnboarding from './Pages/ProviderOnboarding';
import UserRegister from './Pages/UserRegister';
import { ToastProvider } from './contexts/ToastContext';
import './App.css';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5b7fff'
    },
    secondary: {
      main: '#7c4dff'
    },
    background: {
      default: '#f6f8ff',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    },
    h4: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  }
});

function AppContent(): React.JSX.Element {
  
  return (
    <>
    <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="*" element={ <Navigate to="/" replace /> } />
          <Route path="/search" element={ <Search /> } />
          <Route path="/provider/:id" element={ <Profile /> } />
          <Route path="/request-appointment" element={ <RequestAppointment /> } />
          <Route path="/appointments" element={ <Appointments /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <UserRegister /> } />
          <Route path="/provider-onboarding" element={ <ProviderOnboarding /> } />
        </Routes>
    </>);
}

function AppHeader(): React.JSX.Element {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(8px)' }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
        >
          Cita.me
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
          {!isLoading && isAuthenticated ? (
            <>
              <Button component={Link} to="/appointments" color="inherit">Citas</Button>
              <Button component={Link} to="/provider-onboarding" color="inherit">Onboarding</Button>
              <Button onClick={handleLogout} variant="outlined" size="small">Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/search" color="inherit">Proveedores</Button>
              <Button component={Link} to="/login" variant="contained" size="small">Login</Button>
            </>
          )}
          <>
          </>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                background:
                  'linear-gradient(180deg, rgba(91,127,255,0.08) 0%, rgba(124,77,255,0.06) 45%, rgba(246,248,255,1) 100%)'
              }}
            >
              <AppHeader />
              <AppContent />
            </Box>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
