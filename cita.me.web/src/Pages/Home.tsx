import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';

export default function Home(): React.JSX.Element {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '10%' }}>
      <Typography variant="h2" gutterBottom>
        Bienvenido a Cita.me
        </Typography>
        <Typography variant="h5" gutterBottom>
            Encuentra y reserva citas con negocios locales fácilmente.
        </Typography>
        <Typography variant="body1" gutterBottom>
            ¿Cómo podemos ayudarte hoy?
        </Typography>
        <Box mt={4}>
            <Button 
                variant="contained" 
                color="primary"
                component={Link} 
                to="/onboarding"
                style={{ marginRight: '16px' }}
            >
                Quiero ofrecer mis servicios
            </Button>
            <Button 
                variant="outlined" 
                color="primary"
                component={Link} 
                to="/search"
            >
                Quiero encontrar un proveedor de servicios
            </Button>
        </Box>
    </Container>
  );
}
