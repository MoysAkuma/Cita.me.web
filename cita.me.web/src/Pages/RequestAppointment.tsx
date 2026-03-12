import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext.tsx';
import { getSiteProviders, ProviderProfile } from '../data/providers.ts';

type Appointment = {
  id: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  preferredTime: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  notes: string;
  customFields: Record<string, string>;
  requestedByUserId: string | null;
  createdAt: string;
  status: 'pending';
};

type CalendarEvent = {
  id: string;
  appointmentId: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  providerId: string;
  serviceId: string;
  createdAt: string;
};

const normalizeDay = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return -1;
  }
  return hours * 60 + minutes;
};

const toHourLabel = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getWeekdayName = (isoDate: string): string => {
  const date = new Date(`${isoDate}T12:00:00`);
  return normalizeDay(new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date));
};

const formatIcsDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

const escapeIcsText = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const downloadIcsFile = (event: CalendarEvent): void => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const uid = `${event.id}@cita.me.web`;
  const now = formatIcsDate(new Date());
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cita.me//Appointment//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cita-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

type BaseFormData = {
  fullName: string;
  phone: string;
  email: string;
  preferredTime: string;
  notes: string;
};

export default function RequestAppointment(): React.JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const providers = React.useMemo(() => getSiteProviders(), []);
  const [selectedProviderId, setSelectedProviderId] = React.useState<string>(providers[0]?.id ?? '');
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

  const selectedProvider: ProviderProfile | undefined =
    providers.find((provider) => provider.id === selectedProviderId) ?? providers[0];

  React.useEffect(() => {
    if (!selectedProviderId && providers[0]) {
      setSelectedProviderId(providers[0].id);
    }
  }, [providers, selectedProviderId]);

  const availableServices = selectedProvider?.services ?? [];

  const selectedService = availableServices.find((service) => service.id === selectedServiceId);

  const isSelectedDateOnDayOff =
    selectedDate !== '' &&
    (selectedProvider?.schedule.daysOff ?? []).some((day) => normalizeDay(day) === getWeekdayName(selectedDate));

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedProvider || !selectedService || selectedDate === '' || isSelectedDateOnDayOff) {
      return [];
    }

    const openingMinutes = toMinutes(selectedProvider.schedule.openingTime);
    const closingMinutes = toMinutes(selectedProvider.schedule.closingTime);
    const durationMinutes = selectedService.duration.value;

    if (openingMinutes < 0 || closingMinutes < 0 || durationMinutes <= 0 || closingMinutes <= openingMinutes) {
      return [];
    }

    const slots: string[] = [];
    for (let start = openingMinutes; start + durationMinutes <= closingMinutes; start += 30) {
      slots.push(toHourLabel(start));
    }

    return slots;
  }, [
    isSelectedDateOnDayOff,
    selectedDate,
    selectedProvider?.schedule.closingTime,
    selectedProvider?.schedule.openingTime,
    selectedService
  ]);

  React.useEffect(() => {
    if (!availableTimeSlots.includes(baseForm.preferredTime)) {
      setBaseForm((current) => ({
        ...current,
        preferredTime: ''
      }));
    }
  }, [availableTimeSlots, baseForm.preferredTime]);

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
    !isSelectedDateOnDayOff &&
    baseForm.preferredTime.trim() !== '' &&
    baseForm.fullName.trim() !== '' &&
    baseForm.phone.trim() !== '' &&
    requiredCustomFieldsCompleted;

  const saveAppointment = () => {
    if (!selectedProvider || !selectedService || !canConfirmAppointment) {
      return;
    }

    const existingAppointments = JSON.parse(localStorage.getItem('appointments') ?? '[]') as Appointment[];
    const appointment: Appointment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      preferredTime: baseForm.preferredTime,
      requesterName: baseForm.fullName,
      requesterPhone: baseForm.phone,
      requesterEmail: baseForm.email,
      notes: baseForm.notes,
      customFields,
      requestedByUserId: user?.id ?? null,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const start = new Date(`${appointment.date}T${appointment.preferredTime}:00`);
    const end = new Date(start.getTime() + selectedService.duration.value * 60 * 1000);
    const event: CalendarEvent = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      appointmentId: appointment.id,
      title: `Cita: ${selectedService.name}`,
      description: [
        `Proveedor: ${selectedProvider.name}`,
        `Servicio: ${selectedService.name}`,
        `Solicitante: ${appointment.requesterName}`,
        `Teléfono: ${appointment.requesterPhone}`,
        appointment.requesterEmail ? `Email: ${appointment.requesterEmail}` : '',
        appointment.notes ? `Notas: ${appointment.notes}` : ''
      ]
        .filter((line) => line !== '')
        .join('\n'),
      location: `${selectedProvider.name}, ${selectedProvider.city}`,
      start: start.toISOString(),
      end: end.toISOString(),
      providerId: selectedProvider.id,
      serviceId: selectedService.id,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('appointments', JSON.stringify([appointment, ...existingAppointments]));
    const existingCalendarEvents = JSON.parse(localStorage.getItem('calendarEvents') ?? '[]') as CalendarEvent[];
    localStorage.setItem('calendarEvents', JSON.stringify([event, ...existingCalendarEvents]));
    downloadIcsFile(event);
    navigate('/appointments');
  };

  if (!selectedProvider) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Alert severity="warning">No hay proveedores registrados todavía.</Alert>
      </Container>
    );
  }

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
              <Chip size="small" color="primary" label={`Duración: ${selectedService.duration.text}`} />
              <Chip size="small" label={`Precio: ${selectedService.price}`} />
            </Stack>
          )}

          {selectedDate !== '' && isSelectedDateOnDayOff && (
            <Alert severity="warning">
              Este proveedor no atiende el día seleccionado. Elige otra fecha.
            </Alert>
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
                    select
                    label="Hora disponible"
                    value={baseForm.preferredTime}
                    onChange={handleBaseChange('preferredTime')}
                    disabled={availableTimeSlots.length === 0}
                    fullWidth
                  >
                    {availableTimeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </TextField>
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
            <Button
              variant="contained"
              color="primary"
              disabled={!canConfirmAppointment}
              onClick={saveAppointment}
              fullWidth
            >
              Confirmar cita
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
