import React from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

type ServiceField = {
  code: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file';
  required?: boolean;
  options?: string[];
};

type ServiceConfig = {
  id: string;
  name: string;
  duration: string;
  price: string;
  fields: ServiceField[];
};

type Provider = {
  id: string;
  name: string;
  city: string;
  services: ServiceConfig[];
  schedule:{
    openingTime: string;
    closingTime: string;
    daysOff: string[];
  }
};

const providers: Provider[] = [
  {
    id: 'hello-nails',
    name: 'Hello Nails',
    city: 'Culiacan',
    services: [
      {
        id: 'acrilicas',
        name: 'Uñas acrilicas',
        duration: '2 horas',
        price: '$500 MXN',
        fields: [
          {
            code: 'style',
            label: 'Estilo de uñas',
            type: 'select',
            required: true,
            options: ['Natural', 'Almendra', 'Cuadrada', 'Stiletto']
          },
          {
            code: 'reference',
            label: 'Referencia de diseño (descripción)',
            type: 'textarea'
          }
        ]
      },
      {
        id: 'gelish',
        name: 'Gelish',
        duration: '1.5 horas',
        price: '$400 MXN',
        fields: [
          {
            code: 'color',
            label: 'Color principal',
            type: 'text',
            required: true
          },
          {
            code: 'finish',
            label: 'Acabado',
            type: 'select',
            options: ['Brillante', 'Mate', 'Con brillo']
          }
        ]
      }
    ]
  },
  {
    id: 'studio-bella',
    name: 'Studio Bella',
    city: 'Culiacan',
    services: [
      {
        id: 'pedicure',
        name: 'Pedicure',
        duration: '1 hora',
        price: '$300 MXN',
        fields: [
          {
            code: 'sensitive',
            label: '¿Tienes piel sensible?',
            type: 'select',
            options: ['Sí', 'No']
          },
          {
            code: 'notes',
            label: 'Notas especiales',
            type: 'textarea'
          }
        ]
      },
      {
        id: 'spa',
        name: 'Spa de manos',
        duration: '45 min',
        price: '$250 MXN',
        fields: [
          {
            code: 'aroma',
            label: 'Aroma preferido',
            type: 'text'
          }
        ]
      }
    ]
  }
];

type BaseFormData = {
  fullName: string;
  phone: string;
  email: string;
  preferredTime: string;
  notes: string;
};

export default function RequestAppointment(): React.JSX.Element {
  const [selectedProviderId, setSelectedProviderId] = React.useState<string>(providers[0].id);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [baseForm, setBaseForm] = React.useState<BaseFormData>({
    fullName: '',
    phone: '',
    email: '',
    preferredTime: '',
    notes: ''
  });
  const [customFields, setCustomFields] = React.useState<Record<string, string>>({});

  const selectedProvider = providers.find((provider) => provider.id === selectedProviderId) ?? providers[0];

  const availableServices = selectedProvider.services;

  const selectedService = availableServices.find((service) => service.id === selectedServiceId);

  const handleBaseChange = (field: keyof BaseFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBaseForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleCustomChange = (fieldCode: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFields((current) => ({
      ...current,
      [fieldCode]: event.target.value
    }));
  };

  const requiredCustomFieldsCompleted =
    selectedService?.fields
      .filter((field) => field.required)
      .every((field) => (customFields[field.code] ?? '').trim() !== '') ?? true;

  const canConfirmAppointment =
    selectedServiceId !== '' &&
    selectedDate !== '' &&
    baseForm.fullName.trim() !== '' &&
    baseForm.phone.trim() !== '' &&
    requiredCustomFieldsCompleted;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Solicitar cita
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Flujo simple para web y móvil: proveedor, servicio, día y confirmación.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              select
              label="Proveedor"
              value={selectedProviderId}
              onChange={(event) => {
                setSelectedProviderId(event.target.value);
                setSelectedServiceId('');
                setCustomFields({});
              }}
              fullWidth
            >
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name} · {provider.city}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Servicio"
              value={selectedServiceId}
              onChange={(event) => {
                setSelectedServiceId(event.target.value);
                setCustomFields({});
              }}
              fullWidth
            >
              {availableServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label="Día"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            fullWidth
          />

          {selectedService && (
            <Stack direction="row" spacing={1}>
              <Chip size="small" color="primary" label={`Duración: ${selectedService.duration}`} />
              <Chip size="small" label={`Precio: ${selectedService.price}`} />
            </Stack>
          )}

          {selectedDate !== '' && selectedService && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personaliza tu solicitud
              </Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Nombre completo"
                    value={baseForm.fullName}
                    onChange={handleBaseChange('fullName')}
                    fullWidth
                  />
                  <TextField
                    label="Teléfono"
                    value={baseForm.phone}
                    onChange={handleBaseChange('phone')}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Email (opcional)"
                    value={baseForm.email}
                    onChange={handleBaseChange('email')}
                    fullWidth
                  />
                  <TextField
                    label="Hora preferida"
                    value={baseForm.preferredTime}
                    onChange={handleBaseChange('preferredTime')}
                    placeholder="Ejemplo: 4:00 PM"
                    fullWidth
                  />
                </Stack>

                {selectedService.fields.map((field) => {
                  if (field.type === 'select') {
                    return (
                      <TextField
                        key={field.code}
                        select
                        label={field.label}
                        value={customFields[field.code] ?? ''}
                        onChange={handleCustomChange(field.code)}
                        fullWidth
                      >
                        {(field.options ?? []).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <TextField
                        key={field.code}
                        label={field.label}
                        value={customFields[field.code] ?? ''}
                        onChange={handleCustomChange(field.code)}
                        multiline
                        minRows={3}
                        fullWidth
                      />
                    );
                  }

                  return (
                    <TextField
                      key={field.code}
                      label={field.label}
                      value={customFields[field.code] ?? ''}
                      onChange={handleCustomChange(field.code)}
                      fullWidth
                    />
                  );
                })}

                <TextField
                  label="Indicaciones adicionales"
                  value={baseForm.notes}
                  onChange={handleBaseChange('notes')}
                  multiline
                  minRows={3}
                  fullWidth
                />
              </Stack>
            </Box>
          )}

          {!selectedDate && (
            <Alert severity="info">
              Selecciona un día para mostrar el formulario personalizable.
            </Alert>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="outlined" component={Link} to="/search" fullWidth>
              Ver más proveedores
            </Button>
            <Button variant="contained" color="primary" disabled={!canConfirmAppointment} fullWidth>
              Confirm Appointment
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
