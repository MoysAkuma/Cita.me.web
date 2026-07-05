import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type UserRegistrationForm = {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  acercaDeMi: string;
  correo: string;
  contraseña: string;
  confirmarContraseña: string;
  telefono: string;
  telefonoWhatsapp: string;
  fechaNacimiento: string;
  sexo: string;
  profilePhotoUrl: string;
};

const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' }
];

export default function UserRegister(): React.JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<UserRegistrationForm>({
    nombre: '',
    segundoNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    acercaDeMi: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    telefono: '',
    telefonoWhatsapp: '',
    fechaNacimiento: '',
    sexo: '',
    profilePhotoUrl: ''
  });
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const updateForm = (field: keyof UserRegistrationForm) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value
      }));
      if (errorMessage) setErrorMessage('');
    };

  const validateForm = (): boolean => {
    if (!form.nombre.trim()) {
      setErrorMessage('El nombre es requerido');
      return false;
    }
    if (!form.apellidoPaterno.trim()) {
      setErrorMessage('El apellido paterno es requerido');
      return false;
    }
    if (!form.correo.trim()) {
      setErrorMessage('El correo electrónico es requerido');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      setErrorMessage('El correo electrónico no es válido');
      return false;
    }

    if (!form.contraseña) {
      setErrorMessage('La contraseña es requerida');
      return false;
    }
    if (form.contraseña.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (form.contraseña !== form.confirmarContraseña) {
      setErrorMessage('Las contraseñas no coinciden');
      return false;
    }

    if (form.telefono && form.telefono.length < 10) {
      setErrorMessage('El teléfono debe tener al menos 10 dígitos');
      return false;
    }

    if (form.fechaNacimiento) {
      const birthDate = new Date(form.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        setErrorMessage('Debes ser mayor de 18 años para registrarte');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement API call to register user
      setSuccessMessage('¡Usuario registrado exitosamente!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage('Error al registrar usuario. Por favor intenta nuevamente.');
      console.error('Registration error:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Creación de cuenta
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completa el formulario para usar Citame y disfrutar de todas sus funcionalidades. Los campos marcados con * son obligatorios.
              </Typography>
            </Box>

            {errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage('')}>
                {successMessage}
              </Alert>
            )}

            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Información Personal
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Nombre *"
                    fullWidth
                    value={form.nombre}
                    onChange={updateForm('nombre')}
                    inputProps={{ maxLength: 100 }}
                  />
                  <TextField
                    label="Segundo Nombre"
                    fullWidth
                    value={form.segundoNombre}
                    onChange={updateForm('segundoNombre')}
                    inputProps={{ maxLength: 100 }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Apellido Paterno *"
                    fullWidth
                    value={form.apellidoPaterno}
                    onChange={updateForm('apellidoPaterno')}
                    inputProps={{ maxLength: 100 }}
                  />
                  <TextField
                    label="Apellido Materno"
                    fullWidth
                    value={form.apellidoMaterno}
                    onChange={updateForm('apellidoMaterno')}
                    inputProps={{ maxLength: 100 }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    fullWidth
                    value={form.fechaNacimiento}
                    onChange={updateForm('fechaNacimiento')}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Sexo"
                    select
                    fullWidth
                    value={form.sexo}
                    onChange={updateForm('sexo')}
                  >
                    {sexoOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  label="Acerca de Mí"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.acercaDeMi}
                  onChange={updateForm('acercaDeMi')}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${form.acercaDeMi.length}/500 caracteres`}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Información de Contacto
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Correo Electrónico *"
                    type="email"
                    fullWidth
                    value={form.correo}
                    onChange={updateForm('correo')}
                    inputProps={{ maxLength: 100 }}
                  />
                  <TextField
                    label="Teléfono"
                    type="tel"
                    fullWidth
                    value={form.telefono}
                    onChange={updateForm('telefono')}
                    inputProps={{ maxLength: 20 }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Teléfono WhatsApp"
                    type="tel"
                    fullWidth
                    value={form.telefonoWhatsapp}
                    onChange={updateForm('telefonoWhatsapp')}
                    inputProps={{ maxLength: 20 }}
                  />
                  <TextField
                    label="URL Foto de Perfil"
                    fullWidth
                    value={form.profilePhotoUrl}
                    onChange={updateForm('profilePhotoUrl')}
                    inputProps={{ maxLength: 200 }}
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Seguridad
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Contraseña *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.contraseña}
                  onChange={updateForm('contraseña')}
                  inputProps={{ maxLength: 100 }}
                  helperText="Mínimo 8 caracteres"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Confirmar Contraseña *"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.confirmarContraseña}
                  onChange={updateForm('confirmarContraseña')}
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                size="large"
              >
                Registrar Usuario
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate('/login')}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
