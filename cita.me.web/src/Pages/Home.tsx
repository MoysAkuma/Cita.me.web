import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box, Paper, Stack } from '@mui/material';

export default function Home(): React.JSX.Element {
  return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 6 },
                    borderRadius: 4,
                    textAlign: { xs: 'left', md: 'center' },
                    background: 'linear-gradient(120deg, #ffffff 0%, #f8faff 100%)'
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Cita.me
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
                    Agenda tus servicios favoritos en minutos
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto', mb: 3 }}>
                    Encuentra proveedores de confianza, elige un servicio y confirma tu cita desde cualquier dispositivo.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    sx={{ mb: 4 }}
                >
                    <Button variant="contained" size="large" component={Link} to="/search">
                        Buscar proveedores
                    </Button>
                    <Button variant="outlined" size="large" component={Link} to="/provider">
                        Ver perfil de ejemplo
                    </Button>
                    <Button variant="text" size="large" component={Link} to="/request-appointment">
                        Solicitar cita ahora
                    </Button>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Paper elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" fontWeight={700}>1. Elige proveedor</Typography>
                        <Typography variant="body2" color="text.secondary">Explora opciones cercanas con sus servicios y disponibilidad.</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" fontWeight={700}>2. Selecciona fecha</Typography>
                        <Typography variant="body2" color="text.secondary">Escoge el día desde calendario y ajusta tu solicitud.</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" fontWeight={700}>3. Confirma cita</Typography>
                        <Typography variant="body2" color="text.secondary">Completa tus datos y confirma en un solo paso.</Typography>
                    </Paper>
                </Stack>
            </Paper>
    </Container>
  );
}
