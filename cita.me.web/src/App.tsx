import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, Navigate } from 'react-router-dom';
import { AppBar, Box, Button, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import Home from './Pages/Home.tsx';
import Search from './Pages/Search.tsx';
import Profile from './Pages/Profile.tsx';
import RequestAppointment from './Pages/RequestAppointment.tsx';
import Login from './Pages/Login.tsx';

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
          <Route path="/provider" element={ <Profile /> } />
          <Route path="/request-appointment" element={ <RequestAppointment /> } />
          <Route path="/login" element={ <Login /> } />
        </Routes>
    </>);
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
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
                  <Button component={Link} to="/request-appointment" color="inherit">Citas</Button>
                  <Button component={Link} to="/search" color="inherit">Proveedores</Button>
                  <Button component={Link} to="/login" variant="contained" size="small">Login</Button>
                </Box>
              </Toolbar>
            </AppBar>
            <AppContent />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
