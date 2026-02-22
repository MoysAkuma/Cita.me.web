import React from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Login(): React.JSX.Element {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Inicia sesión para gestionar tus citas.
            </Typography>
          </Box>

          <TextField label="Email" type="email" fullWidth />
          <TextField label="Contraseña" type="password" fullWidth />

          <Button variant="contained" fullWidth>
            Entrar
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
