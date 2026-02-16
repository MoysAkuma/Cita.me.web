import React from 'react';
import { Link } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	Chip,
	Container,
	Divider,
	Paper,
	Stack,
	Typography
} from '@mui/material';

const provider = {
	name: 'Hello Nails',
	service: 'Uñas acrilicas, Gelish, Pedicure & Spa',
	rating: '5.0',
	city: 'Culiacan',
    state: 'Sinaloa',
    country : 'Mexico',
	address: 'Pablo macias valenzuela 4465, Fraccionamiento Jardines del Valle',
	phone: '+52 667 270 0481',
	email: 'fersh.cl17@gmail.com',
	whatsapp: '+52 667 270 0481',
	about:
		'Atencion detallada y productos hipoalergenicos. Especialista en uñas acrilicas, Gelish, Pedicure & Spa.',
	services: [
		'Uñas acrilicas',
		'Gelish',
		'Pedicure',
		'Spa'
	],
	languages: ['Espanol'],
	schedule: [
		{ day: 'Lun', hours: '09:00 - 18:00', status: 'Disponible' },
		{ day: 'Mar', hours: '09:00 - 18:00', status: 'Disponible' },
		{ day: 'Mie', hours: '09:00 - 20:00', status: 'Alta demanda' },
		{ day: 'Jue', hours: '09:00 - 18:00', status: 'Disponible' },
		{ day: 'Vie', hours: '10:00 - 19:00', status: 'Disponible' },
		{ day: 'Sab', hours: '10:00 - 14:00', status: 'Pocas citas' },
		{ day: 'Dom', hours: 'No disponible', status: 'Cerrado' }
	],
	requestInfo: [
		'Selecciona un servicio y una hora disponible.',
		'Confirma tus datos de contacto y metodo de pago.',
		'Recibe confirmacion inmediata y recordatorios.'
	],
	responseTime: 'Responde en menos de 1 hora',
	bookingWindow: 'Reservas con 24 horas de anticipacion'
};

export default function Profile(): React.JSX.Element {
	return (
		<Container maxWidth="lg" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
			<Paper
				elevation={0}
				style={{
					padding: '28px',
					borderRadius: '20px',
					background: 'linear-gradient(120deg, #ffe7c4 0%, #fff3dc 45%, #f7fbff 100%)'
				}}
			>
				<Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="center">
					<Avatar
						sx={{ width: 96, height: 96, bgcolor: '#ffb74d', color: '#3e2723', fontSize: '32px' }}
					>
						{provider.name
							.split(' ')
							.map((part) => part[0])
							.join('')}
					</Avatar>
					<Box flex={1}>
						<Typography
							variant="h3"
							style={{ fontWeight: 700, color: '#2b2b2b', fontFamily: 'Playfair Display' }}
						>
							{provider.name}
						</Typography>
						<Typography variant="h6" style={{ color: '#555', marginTop: '6px' }}>
							{provider.service}
						</Typography>
						<Stack direction="row" spacing={1} style={{ marginTop: '14px', flexWrap: 'wrap' }}>
							<Chip label={`Calificacion ${provider.rating}`} style={{ backgroundColor: '#ffe0b2' }} />
							<Chip label={provider.city} />
							<Chip label={provider.responseTime} />
							<Chip label={provider.bookingWindow} />
						</Stack>
					</Box>
					<Stack spacing={1.5} style={{ minWidth: '180px' }}>
						<Button variant="contained" color="primary" size="large">
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
						Sobre el servicio
					</Typography>
					<Typography variant="body1" style={{ color: '#555', lineHeight: 1.7 }}>
						{provider.about}
					</Typography>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Servicios
					</Typography>
					<Stack direction="row" spacing={1} style={{ marginTop: '12px', flexWrap: 'wrap' }}>
						{provider.services.map((service) => (
							<Chip key={service} label={service} style={{ marginBottom: '8px' }} />
						))}
					</Stack>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Idiomas
					</Typography>
					<Stack direction="row" spacing={1} style={{ marginTop: '12px' }}>
						{provider.languages.map((language) => (
							<Chip key={language} label={language} variant="outlined" />
						))}
					</Stack>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Disponibilidad semanal
					</Typography>
					<Stack spacing={1.5} style={{ marginTop: '16px' }}>
						{provider.schedule.map((slot) => (
							<Box
								key={slot.day}
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography variant="body1" style={{ fontWeight: 600 }}>
									{slot.day}
								</Typography>
								<Typography variant="body1" style={{ color: '#555' }}>
									{slot.hours}
								</Typography>
								<Chip
									label={slot.status}
									size="small"
									style={{
										backgroundColor:
											slot.status === 'Cerrado'
												? '#eeeeee'
												: slot.status === 'Alta demanda'
												? '#ffccbc'
												: slot.status === 'Pocas citas'
												? '#ffe0b2'
												: '#dcedc8'
									}}
								/>
							</Box>
						))}
					</Stack>
				</Paper>

				<Paper elevation={0} style={{ width: '320px', padding: '24px', borderRadius: '18px' }}>
					<Typography variant="h5" gutterBottom style={{ fontWeight: 700 }}>
						Informacion de contacto
					</Typography>
					<Stack spacing={1.5}>
						<Typography variant="body1">
							Direccion: {provider.address}
						</Typography>
						<Typography variant="body1">Telefono: {provider.phone}</Typography>
						<Typography variant="body1">Email: {provider.email}</Typography>
						<Typography variant="body1">WhatsApp: {provider.whatsapp}</Typography>
					</Stack>
					<Divider style={{ margin: '24px 0' }} />
					<Typography variant="h6" style={{ fontWeight: 700 }}>
						Como solicitar un servicio
					</Typography>
					<Stack spacing={1.5} style={{ marginTop: '12px' }}>
						{provider.requestInfo.map((step, index) => (
							<Box key={step} display="flex" gap={1.5}>
								<Chip label={`${index + 1}`} size="small" style={{ backgroundColor: '#ffe0b2' }} />
								<Typography variant="body2" style={{ color: '#555' }}>
									{step}
								</Typography>
							</Box>
						))}
					</Stack>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						style={{ marginTop: '24px' }}
					>
						Reservar ahora
					</Button>
				</Paper>
			</Box>
		</Container>
	);
}
