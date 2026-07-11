import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const [correo, setCorreo] = React.useState('');
  const [contraseña, setContraseña] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError('');

    if (!correo.trim()) {
      setValidationError('El correo electrónico es requerido');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setValidationError('El correo electrónico no es válido');
      return;
    }
    if (!contraseña) {
      setValidationError('La contraseña es requerida');
      return;
    }

    try {
      await login(correo, contraseña);
    } catch (err) {
      // El error ya está manejado en el contexto
      console.error('Error en login:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Inicia sesión para gestionar tus citas.
              </Typography>
            </Box>

            {validationError && (
              <Alert severity="error" onClose={() => setValidationError('')}>
                {validationError}
              </Alert>
            )}
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={correo}
              onChange={(e) => { setCorreo(e.target.value); setValidationError(''); }}
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={contraseña}
              onChange={(e) => { setContraseña(e.target.value); setValidationError(''); }}
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              {isLoading ? 'Ingresando...' : 'Entrar'}
            </Button>
            <Button variant="text" fullWidth onClick={() => navigate('/register')}>
              ¿No tienes cuenta? Regístrate
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
