import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { ProviderProfile, ServiceConfig, saveProviderProfile } from '../data/providers';

type OnboardingService = {
  name: string;
  durationText: string;
  durationValue: string;
  price: string;
  description: string;
};

type OnboardingForm = {
  providerName: string;
  serviceCategory: string;
  about: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  openingTime: string;
  closingTime: string;
  taxId: string;
  legalBusinessName: string;
  legalRepresentative: string;
};

const serviceCategories = [
  'Uñas y belleza',
  'Barbería',
  'Spa y bienestar',
  'Salón de belleza',
  'Maquillaje profesional',
  'Masajes terapéuticos',
  'Otro'
];

const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const emptyService: OnboardingService = {
  name: '',
  durationText: '',
  durationValue: '',
  price: '',
  description: ''
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function ProviderOnboarding(): React.JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<OnboardingForm>({
    providerName: '',
    serviceCategory: '',
    about: '',
    city: '',
    state: '',
    country: 'México',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    openingTime: '09:00',
    closingTime: '18:00',
    taxId: '',
    legalBusinessName: '',
    legalRepresentative: ''
  });
  const [daysOff, setDaysOff] = React.useState<string[]>([]);
  const [services, setServices] = React.useState<OnboardingService[]>([{ ...emptyService }]);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = React.useState(false);
  const [confirmCompliance, setConfirmCompliance] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const updateForm = (field: keyof OnboardingForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const updateService =
    (index: number, field: keyof OnboardingService) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setServices((current) =>
        current.map((service, serviceIndex) =>
          serviceIndex === index
            ? {
                ...service,
                [field]: event.target.value
              }
            : service
        )
      );
    };

  const toggleDayOff = (day: string) => () => {
    setDaysOff((current) =>
      current.includes(day) ? current.filter((currentDay) => currentDay !== day) : [...current, day]
    );
  };

  const addService = () => {
    setServices((current) => [...current, { ...emptyService }]);
  };

  const removeService = (index: number) => () => {
    setServices((current) => current.filter((_, serviceIndex) => serviceIndex !== index));
  };

  const isBaseInfoComplete =
    form.providerName.trim() !== '' &&
    form.serviceCategory.trim() !== '' &&
    form.city.trim() !== '' &&
    form.state.trim() !== '' &&
    form.country.trim() !== '' &&
    form.address.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.openingTime.trim() !== '' &&
    form.closingTime.trim() !== '';

  const isLegalInfoComplete =
    form.taxId.trim() !== '' &&
    form.legalBusinessName.trim() !== '' &&
    form.legalRepresentative.trim() !== '' &&
    acceptTerms &&
    acceptPrivacy &&
    confirmCompliance;

  const hasValidServices =
    services.length > 0 &&
    services.every(
      (service) =>
        service.name.trim() !== '' &&
        service.durationText.trim() !== '' &&
        Number(service.durationValue) > 0 &&
        service.price.trim() !== ''
    );

  const canSubmit = isBaseInfoComplete && isLegalInfoComplete && hasValidServices;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage('Completa todos los campos obligatorios, servicios y validaciones legales.');
      return;
    }

    const openingMinutes = Number(form.openingTime.split(':')[0]) * 60 + Number(form.openingTime.split(':')[1]);
    const closingMinutes = Number(form.closingTime.split(':')[0]) * 60 + Number(form.closingTime.split(':')[1]);

    if (closingMinutes <= openingMinutes) {
      setErrorMessage('La hora de cierre debe ser mayor a la hora de apertura.');
      return;
    }

    const mappedServices: ServiceConfig[] = services.map((service, index) => ({
      id: `${slugify(service.name)}-${index + 1}`,
      name: service.name.trim(),
      duration: {
        text: service.durationText.trim(),
        value: Number(service.durationValue)
      },
      price: service.price.trim(),
      fields: [
        {
          code: 'notes',
          label: 'Notas adicionales',
          type: 'textarea'
        }
      ]
    }));

    const idBase = slugify(form.providerName);
    const profile: ProviderProfile = {
      id: `${idBase}-${Date.now()}`,
      name: form.providerName.trim(),
      serviceCategory: form.serviceCategory,
      about: form.about.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim() || form.phone.trim(),
      services: mappedServices,
      schedule: {
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        daysOff
      },
      legal: {
        businessName: form.legalBusinessName.trim(),
        legalRepresentative: form.legalRepresentative.trim(),
        taxId: form.taxId.trim(),
        termsAcceptedAt: new Date().toISOString(),
        privacyAcceptedAt: new Date().toISOString(),
        complianceConfirmed: true
      }
    };

    saveProviderProfile(profile);
    navigate('/search');
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Onboarding
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Unete a Citame y administra tus citas de manera fácil y eficiente.
            </Typography>
          </Box>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Typography variant="h6">Información del negocio</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Nombre comercial" value={form.providerName} onChange={updateForm('providerName')} fullWidth required />
            <TextField select label="Categoría de servicio" value={form.serviceCategory} onChange={updateForm('serviceCategory')} fullWidth required>
              {serviceCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField label="Descripción del negocio" value={form.about} onChange={updateForm('about')} multiline minRows={3} fullWidth />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Ciudad" value={form.city} onChange={updateForm('city')} fullWidth required />
            <TextField label="Estado" value={form.state} onChange={updateForm('state')} fullWidth required />
          </Stack>

          <TextField label="Dirección" value={form.address} onChange={updateForm('address')} fullWidth required />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Teléfono" value={form.phone} onChange={updateForm('phone')} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={updateForm('email')} fullWidth required />
            <TextField label="WhatsApp" value={form.whatsapp} onChange={updateForm('whatsapp')} fullWidth />
          </Stack>

          <Typography variant="h6">Horario de atención</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Hora apertura"
              type="time"
              value={form.openingTime}
              onChange={updateForm('openingTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Hora cierre"
              type="time"
              value={form.closingTime}
              onChange={updateForm('closingTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Días de descanso
            </Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
              {weekDays.map((day) => (
                <FormControlLabel
                  key={day}
                  control={<Checkbox checked={daysOff.includes(day)} onChange={toggleDayOff(day)} />}
                  label={day}
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="h6">Servicios y precios</Typography>
          <Stack spacing={2}>
            {services.map((service, index) => (
              <Paper key={`${index + 1}-service`} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Nombre del servicio"
                      value={service.name}
                      onChange={updateService(index, 'name')}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Precio"
                      value={service.price}
                      onChange={updateService(index, 'price')}
                      placeholder="$500 MXN"
                      fullWidth
                      required
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Duración visible"
                      value={service.durationText}
                      onChange={updateService(index, 'durationText')}
                      placeholder="1 hora 30 min"
                      fullWidth
                      required
                    />
                    <TextField
                      label="Duración en minutos"
                      type="number"
                      value={service.durationValue}
                      onChange={updateService(index, 'durationValue')}
                      inputProps={{ min: 1 }}
                      fullWidth
                      required
                    />
                  </Stack>

                  <TextField
                    label="Descripción del servicio"
                    value={service.description}
                    onChange={updateService(index, 'description')}
                    multiline
                    minRows={2}
                    fullWidth
                  />

                  <Box>
                    <Button variant="text" color="error" disabled={services.length === 1} onClick={removeService(index)}>
                      Eliminar servicio
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            ))}

            <Button variant="outlined" onClick={addService}>
              Agregar otro servicio
            </Button>
          </Stack>

          <Typography variant="h6">Datos legales y cumplimiento</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Razón social" value={form.legalBusinessName} onChange={updateForm('legalBusinessName')} fullWidth required />
            <TextField label="Representante legal" value={form.legalRepresentative} onChange={updateForm('legalRepresentative')} fullWidth required />
          </Stack>
          <TextField label="RFC o identificación fiscal" value={form.taxId} onChange={updateForm('taxId')} fullWidth required />

          <Stack>
            <FormControlLabel
              control={<Checkbox checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} />}
              label="Acepto Términos y Condiciones del marketplace."
            />
            <FormControlLabel
              control={<Checkbox checked={acceptPrivacy} onChange={(event) => setAcceptPrivacy(event.target.checked)} />}
              label="Acepto Aviso de Privacidad y tratamiento de datos personales."
            />
            <FormControlLabel
              control={<Checkbox checked={confirmCompliance} onChange={(event) => setConfirmCompliance(event.target.checked)} />}
              label="Declaro que tengo autorización legal para ofrecer estos servicios y emitir comprobantes cuando aplique."
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" type="submit" disabled={!canSubmit} fullWidth>
              Crear perfil de proveedor
            </Button>
            <Button variant="outlined" onClick={() => navigate('/search')} fullWidth>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
