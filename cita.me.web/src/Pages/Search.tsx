import React from 'react';
import { Link } from 'react-router-dom';
import Filters from '../Components/Search/Filters';
import {
    Button,
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { useGetProviders } from '../hooks/Provider/useGetProviders';

function getNextAvailableLabel(openingTime: string): string {
    return `Desde hoy ${openingTime}`;
}

export default function Search(): React.JSX.Element {
    const { providers, loading, error, refetchProviders } = useGetProviders(1, 20, {});

  return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
            <Typography variant="h4" gutterBottom>
                Descubre servicios cerca de ti
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Filtra por ubicación o fecha y agenda en minutos.
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
                <Filters onSearch={refetchProviders} />
            </Paper>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!!error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && (
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
                                        <Typography variant="h6">{provider.nombre_comercial}</Typography>
                                        <Chip size="small" label={`${provider.categoria.name}`} color="primary" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {provider.servicios.map((service) => service.name).join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">{provider.ciudad.name}, {provider.estado.name}</Typography>
                                    <Chip
                                        size="small"
                                        label={`Disponible: ${getNextAvailableLabel(provider.horario[0]?.hora_apertura ?? '--:--')}`}
                                        sx={{ width: 'fit-content' }}
                                    />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ pt: 1 }}>
                                        <Button component={Link} to={`/provider/${provider.id}`} variant="outlined" fullWidth>
                                            Ver perfil
                                        </Button>
                                        <Button component={Link} to={`/request-appointment/${provider.id}`} variant="contained" fullWidth>
                                            Solicitar cita
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
            )}
        </Container>
    );
}