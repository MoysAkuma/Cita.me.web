import React from 'react';
import { Link } from 'react-router-dom';
import Filters from '../Components/Search/Filters.tsx';
import {
    Button,
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Paper
} from '@mui/material';

const providers = [
    {
        id: 'hello-nails',
        name: 'Hello Nails',
        location: 'Culiacan, Sinaloa',
        service: 'Uñas acrilicas, Gelish, Pedicure & Spa',
        rating: '5.0',
        nextAvailable: 'Hoy 4:00 PM'
    },
    {
        id: 'studio-bella',
        name: 'Studio Bella',
        location: 'Culiacan, Sinaloa',
        service: 'Manicure, Pedicure, Spa de manos',
        rating: '4.8',
        nextAvailable: 'Mañana 10:30 AM'
    },
    {
        id: 'nails-lounge',
        name: 'Nails Lounge',
        location: 'Culiacan, Sinaloa',
        service: 'Gel, diseño premium, retiro',
        rating: '4.9',
        nextAvailable: 'Sábado 1:00 PM'
    }
];

export default function Search(): React.JSX.Element {
  return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
            <Typography variant="h4" gutterBottom>
                Descubre servicios cerca de ti
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Filtra por ubicación o fecha y agenda en minutos.
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
                <Filters />
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2.5,
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
                }}
            >
                {providers.map((provider) => (
                    <Box key={provider.id}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <CardContent>
                                <Stack spacing={1.2}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                                        <Typography variant="h6">{provider.name}</Typography>
                                        <Chip size="small" label={`⭐ ${provider.rating}`} color="primary" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{provider.service}</Typography>
                                    <Typography variant="body2" color="text.secondary">{provider.location}</Typography>
                                    <Chip size="small" label={`Disponible: ${provider.nextAvailable}`} sx={{ width: 'fit-content' }} />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ pt: 1 }}>
                                        <Button component={Link} to="/provider" variant="outlined" fullWidth>
                                            Ver perfil
                                        </Button>
                                        <Button component={Link} to="/request-appointment" variant="contained" fullWidth>
                                            Solicitar cita
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}