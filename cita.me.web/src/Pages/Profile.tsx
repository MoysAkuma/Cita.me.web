import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
	Avatar,
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Paper,
	Stack,
	Typography
} from '@mui/material';
import { useGetProvider } from '../hooks/Provider/useGetProvider';

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

export default function Profile(): React.JSX.Element {
	const { id } = useParams<{ id: string }>();
	const { provider, loading, error } = useGetProvider(id ?? '');

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	if (!provider) {
		return (
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Alert severity="warning">No se encontro informacion del proveedor.</Alert>
			</Container>
		);
	}

	const scheduleByDay = new Map(
		(provider.horario ?? []).map((slot) => [slot.dia_semana, slot])
	);

	return (
		<Container 
			maxWidth="lg" 
			style={{ paddingTop: '48px', paddingBottom: '64px' }}>
			<Paper
				elevation={0}
				style={{
					padding: '28px',
					borderRadius: '20px',
					background: 'linear-gradient(120deg, #ffe7c4 0%, #fff3dc 45%, #f7fbff 100%)'
				}}
			>
				<Stack 
					spacing={3} 
					direction={{ xs: 'column', md: 'row' }} 
					alignItems="center">
					<Avatar
						sx={{ width: 96, height: 96, 
							bgcolor: '#ffb74d', 
							color: '#3e2723', 
							fontSize: '32px' }}
					>
						{provider.nombre_comercial
							.split(' ')
							.map((part) => part[0])
							.join('')}
					</Avatar>
					<Box flex={1}>
						<Typography
							variant="h3"
							style={{ fontWeight: 700, color: '#2b2b2b', fontFamily: 'Playfair Display' }}
						>
							{provider.nombre_comercial}
						</Typography>
						<Typography variant="h6" style={{ color: '#555', marginTop: '6px' }}>
							{provider.descripcion || 'Sin descripcion disponible.'}
						</Typography>
						<Stack direction="row" spacing={1} style={{ marginTop: '14px', flexWrap: 'wrap' }}>
							<Chip label={`Calificacion ${provider.rating}`} style={{ backgroundColor: '#ffe0b2' }} />
							<Chip label={`${provider.ciudad.name}, ${provider.estado.name}`} />
							<Chip label={provider.categoria.name} />
						</Stack>
					</Box>
					<Stack spacing={1.5} style={{ minWidth: '180px' }}>
						<Button variant="contained" color="primary" size="large" component={Link} to="/request-appointment">
							Solicitar cita
						</Button>
						<Button variant="outlined" color="primary" component={Link} to="/search">
							Ver mas proveedores
						</Button>
					</Stack>
				</Stack>
			</Paper>

			<Box mt={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
				<Paper elevation={0} style={{ flex: 1, padding: '24px', borderRadius: '18px' }}>
					<Typography variant="h5" gutterBottom style={{ fontWeight: 700 }}>
						Acerca de {provider.nombre_comercial}
					</Typography>
					<Typography 
						variant="body1" 
						style={{ color: '#555', lineHeight: 1.7 }}>
						{provider.descripcion || 'Sin descripcion disponible.'}
					</Typography>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Servicios
					</Typography>
					<Stack direction="row" spacing={1} style={{ marginTop: '12px', flexWrap: 'wrap' }}>
						{provider.servicios?.map((service) => (
							<Chip key={service.id} label={service.name} style={{ marginBottom: '8px' }} />
						))}
					</Stack>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Disponibilidad
					</Typography>
					<Stack spacing={1.5} style={{ marginTop: '16px' }}>
						{dayLabels.map((dayLabel, dayIndex) => {
							const slot = scheduleByDay.get(dayIndex);
							const isRetrieved = Boolean(slot);
							const availability = slot?.disponibilidad || (isRetrieved ? 'Disponible' : 'Sin datos');
							const hours = isRetrieved
								? `${slot?.hora_apertura} - ${slot?.hora_cierre}`
								: 'No disponible';

							return (
							<Box
								key={dayLabel}
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography variant="body1" style={{ fontWeight: 600 }}>
									{dayLabel}
								</Typography>
								<Typography variant="body1" style={{ color: '#555' }}>
									{hours}
								</Typography>
								<Chip
									label={availability}
									size="small"
									style={{
										backgroundColor:
											availability === 'Cerrado'
												? '#eeeeee'
												: availability === 'Alta demanda'
												? '#ffccbc'
												: availability === 'Pocas citas'
												? '#ffe0b2'
												: availability === 'Sin datos'
												? '#eeeeee'
												: '#dcedc8'
									}}
								/>
							</Box>
							);
						})}
						{(!provider.horario || provider.horario.length === 0) && (
							<Typography variant="body2" style={{ color: '#777' }}>
								No hay horarios registrados. Se muestran los dias con estado por defecto.
							</Typography>
						)}
					</Stack>
				</Paper>

				<Paper elevation={0} style={{ width: '320px', padding: '24px', borderRadius: '18px' }}>
					<Typography variant="h5" gutterBottom style={{ fontWeight: 700 }}>
						Informacion de contacto
					</Typography>
					<Stack spacing={1.5}>
						<Typography variant="body1">
							Direccion: {provider.direccion || 'No especificada'}
						</Typography>
						<Typography variant="body1">Telefono: {provider.telefono || 'No especificado'}</Typography>
						<Typography variant="body1">WhatsApp: {provider.whatsapp}</Typography>
					</Stack>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Ubicacion
					</Typography>
					<Stack spacing={1.5} style={{ marginTop: '12px' }}>
						<Typography variant="body2" style={{ color: '#555' }}>Ciudad: {provider.ciudad.name}</Typography>
						<Typography variant="body2" style={{ color: '#555' }}>Estado: {provider.estado.name}</Typography>
						<Typography variant="body2" style={{ color: '#555' }}>Categoria: {provider.categoria.name}</Typography>
					</Stack>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						component={Link}
						to="/request-appointment"
						style={{ marginTop: '24px' }}
					>
						Reservar ahora
					</Button>
				</Paper>
			</Box>
		</Container>
	);
}
