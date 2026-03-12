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
import { getSiteProviders } from '../data/providers.ts';

function getNextAvailableLabel(openingTime: string): string {
    return `Desde hoy ${openingTime}`;
}

export default function Search(): React.JSX.Element {
    const providers = React.useMemo(() => getSiteProviders(), []);

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
                                        <Chip size="small" label={provider.serviceCategory} color="primary" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {provider.services.map((service) => service.name).join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">{provider.city}, {provider.state}</Typography>
                                    <Chip size="small" label={`Disponible: ${getNextAvailableLabel(provider.schedule.openingTime)}`} sx={{ width: 'fit-content' }} />
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