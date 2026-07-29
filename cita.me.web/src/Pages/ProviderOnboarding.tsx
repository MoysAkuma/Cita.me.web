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
import { ProviderProfile } from '../data/providers';
import { useCatProveedores } from '../hooks/Catalogues/useCatProveedores';
import { useCatEstados } from '../hooks/Catalogues/useCatEstados';
import { useCatCiudad } from '../hooks/Catalogues/useCatCiudad';

type OnboardingService = ProviderProfile['servicios'][number];

type CatalogueOption = {
  value: number;
  label: string;
};

type OnboardingForm = Omit<ProviderProfile, 'id' | 'adminId' | 'horario' | 'servicios' | 'rating'> & {
  hora_apertura: string;
  hora_cierre: string;
  dias_descanso: number[];
  servicios: OnboardingService[];
};

const weekDays = [
  { id: 1, label: 'lunes' },
  { id: 2, label: 'martes' },
  { id: 3, label: 'miércoles' },
  { id: 4, label: 'jueves' },
  { id: 5, label: 'viernes' },
  { id: 6, label: 'sábado' },
  { id: 7, label: 'domingo' }
];

const emptyService: OnboardingService = {
  id: 1,
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  rating: '0.0',
  es_destacado: false,
  orden: 1
};

const providersStorageKey = 'siteProviders';

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
  const { getProveedores } = useCatProveedores();
  const { getEstados } = useCatEstados();
  const { getCiudades } = useCatCiudad();
  const hasLoadedCatalogues = React.useRef(false);
  const [form, setForm] = React.useState<OnboardingForm>({
    nombre_comercial: '',
    categoria: 0,
    descripcion: '',
    ciudad: 0,
    estado: 0,
    direccion: '',
    telefono: '',
    email: '',
    telefono_whatsapp: '',
    codigo_postal: '',
    hora_apertura: '09:00',
    hora_cierre: '18:00',
    nombre_legal: '',
    rfc: '',
    servicios: [{ ...emptyService }],
    dias_descanso: []

  });
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = React.useState(false);
  const [confirmCompliance, setConfirmCompliance] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [providerCategories, setProviderCategories] = React.useState<CatalogueOption[]>([]);
  const [states, setStates] = React.useState<CatalogueOption[]>([]);
  const [cities, setCities] = React.useState<CatalogueOption[]>([]);

  const toCatalogueItems = React.useCallback((response: any): any[] => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  }, []);

  const toCatalogueOptions = React.useCallback(
    (response: any): CatalogueOption[] =>
      toCatalogueItems(response)
        .map((item: any) => {
          const rawValue = item?.id ?? item?.value;
          const value = Number(rawValue);
          const label =
            item?.nombre ??
            item?.name ??
            item?.label ??
            item?.text ??
            item?.descripcion;

          if (!Number.isFinite(value) || !label) {
            return null;
          }

          return {
            value,
            label: String(label)
          };
        })
        .filter((item: CatalogueOption | null): item is CatalogueOption => item !== null),
    [toCatalogueItems]
  );

  const loadCatalogues = React.useCallback(async () => {
    try {
      const [providersResponse, statesResponse, citiesResponse] = await Promise.all([
        getProveedores(),
        getEstados(),
        getCiudades()
      ]);

      setProviderCategories(toCatalogueOptions(providersResponse));
      setStates(toCatalogueOptions(statesResponse));
      setCities(toCatalogueOptions(citiesResponse));
    } catch (error: any) {
      setErrorMessage(error.message || 'No se pudieron cargar los catálogos iniciales.');
    }
  }, [getProveedores, getEstados, getCiudades, toCatalogueOptions]);

  React.useEffect(() => {
    if (hasLoadedCatalogues.current) {
      return;
    }

    hasLoadedCatalogues.current = true;
    void loadCatalogues();
  }, [loadCatalogues]);

  const updateForm =
    (field: keyof OnboardingForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
    };

  const updateNumericForm =
    (field: 'categoria' | 'estado' | 'ciudad') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: Number(event.target.value)
      }));
    };

  const updateService =
    (index: number, field: keyof OnboardingService) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        servicios: current.servicios.map((service, serviceIndex) =>
          serviceIndex === index
            ? {
                ...service,
                [field]: event.target.value
              }
            : service
        )
      }));
    };

  const updateServiceHighlight = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      servicios: current.servicios.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              es_destacado: event.target.checked
            }
          : service
      )
    }));
  };

  const toggleDayOff = (day: number) => () => {
    setForm((current) => ({
      ...current,
      dias_descanso: current.dias_descanso.includes(day)
        ? current.dias_descanso.filter((currentDay) => currentDay !== day)
        : [...current.dias_descanso, day]
    }));
  };

  const addService = () => {
    setForm((current) => ({
      ...current,
      servicios: [
        ...current.servicios,
        {
          ...emptyService,
          id: current.servicios.length + 1,
          orden: current.servicios.length + 1
        }
      ]
    }));
  };

  const removeService = (index: number) => () => {
    setForm((current) => ({
      ...current,
      servicios: current.servicios
        .filter((_, serviceIndex) => serviceIndex !== index)
        .map((service, serviceIndex) => ({
          ...service,
          id: serviceIndex + 1,
          orden: serviceIndex + 1
        }))
    }));
  };

  const isBaseInfoComplete =
    form.nombre_comercial.trim() !== '' &&
    form.categoria !== 0 &&
    form.ciudad !== 0 &&
    form.estado !== 0 &&
    form.direccion.trim() !== '' &&
    form.codigo_postal.trim() !== '' &&
    form.telefono.trim() !== '' &&
    form.email.trim() !== '' &&
    form.hora_apertura.trim() !== '' &&
    form.hora_cierre.trim() !== '';

  const isLegalInfoComplete =
    form.rfc.trim() !== '' &&
    form.nombre_legal.trim() !== '' &&
    acceptTerms &&
    acceptPrivacy &&
    confirmCompliance;

  const hasValidServices =
    form.servicios.length > 0 &&
    form.servicios.every(
      (service) =>
        service.nombre.trim() !== '' &&
        service.duracion.trim() !== '' &&
        service.precio.trim() !== ''
    );

  const canSubmit = isBaseInfoComplete && isLegalInfoComplete && hasValidServices;

  const saveProviderProfile = React.useCallback((providerProfile: ProviderProfile) => {
    const existingProviders = JSON.parse(localStorage.getItem(providersStorageKey) ?? '[]') as ProviderProfile[];
    const hasProvider = existingProviders.some((provider) => provider.id === providerProfile.id);
    const updatedProviders = hasProvider
      ? existingProviders.map((provider) => (provider.id === providerProfile.id ? providerProfile : provider))
      : [...existingProviders, providerProfile];

    localStorage.setItem(providersStorageKey, JSON.stringify(updatedProviders));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage('Completa todos los campos obligatorios, servicios y validaciones legales.');
      return;
    }

    const openingMinutes = Number(form.hora_apertura.split(':')[0]) * 60 + Number(form.hora_apertura.split(':')[1]);
    const closingMinutes = Number(form.hora_cierre.split(':')[0]) * 60 + Number(form.hora_cierre.split(':')[1]);

    if (closingMinutes <= openingMinutes) {
      setErrorMessage('La hora de cierre debe ser mayor a la hora de apertura.');
      return;
    }

    const businessId = `${slugify(form.nombre_comercial)}-${Date.now()}`;
    const mappedSchedule = weekDays
      .filter((day) => !form.dias_descanso.includes(day.id))
      .map((day) => ({
        hora_apertura: form.hora_apertura,
        hora_cierre: form.hora_cierre,
        dia_semana: day.id,
        status: 'activo',
        disponibilidad: 'disponible'
      }));

    const mappedServices = form.servicios.map((service, index) => ({
      ...service,
      id: index + 1,
      orden: index + 1,
      nombre: service.nombre.trim(),
      descripcion: service.descripcion.trim(),
      duracion: service.duracion.trim(),
      precio: service.precio.trim(),
      rating: service.rating.trim() === '' ? '0.0' : service.rating.trim()
    }));

    const providerProfile: ProviderProfile = {
      id: businessId,
      adminId: `admin-${businessId}`,
      categoria: form.categoria,
      ciudad: form.ciudad,
      estado: form.estado,
      nombre_legal: form.nombre_legal.trim(),
      nombre_comercial: form.nombre_comercial.trim(),
      rfc: form.rfc.trim(),
      descripcion: form.descripcion.trim(),
      rating: '0.0',
      direccion: form.direccion.trim(),
      codigo_postal: form.codigo_postal.trim(),
      telefono: form.telefono.trim(),
      telefono_whatsapp: form.telefono_whatsapp.trim(),
      email: form.email.trim(),
      horario: mappedSchedule,
      servicios: mappedServices
    };

    saveProviderProfile(providerProfile);
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
            <TextField label="Nombre comercial" value={form.nombre_comercial} onChange={updateForm('nombre_comercial')} fullWidth required />
            <TextField select label="Categoría de servicio" value={form.categoria} onChange={updateNumericForm('categoria')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona una categoría
              </MenuItem>
              {providerCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField label="Descripción del negocio" value={form.descripcion} onChange={updateForm('descripcion')} multiline minRows={3} fullWidth />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField select label="Ciudad" value={form.ciudad} onChange={updateNumericForm('ciudad')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona una ciudad
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Estado" value={form.estado} onChange={updateNumericForm('estado')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona un estado
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {state.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField label="Dirección" value={form.direccion} onChange={updateForm('direccion')} fullWidth required />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Teléfono" value={form.telefono} onChange={updateForm('telefono')} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={updateForm('email')} fullWidth required />
            <TextField label="WhatsApp" value={form.telefono_whatsapp} onChange={updateForm('telefono_whatsapp')} fullWidth />
          </Stack>

          <TextField label="Código postal" value={form.codigo_postal} onChange={updateForm('codigo_postal')} fullWidth required />

          <Typography variant="h6">Horario de atención</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Hora apertura"
              type="time"
              value={form.hora_apertura}
              onChange={updateForm('hora_apertura')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Hora cierre"
              type="time"
              value={form.hora_cierre}
              onChange={updateForm('hora_cierre')}
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
                  key={day.id}
                  control={<Checkbox checked={form.dias_descanso.includes(day.id)} onChange={toggleDayOff(day.id)} />}
                  label={day.label}
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="h6">Servicios y precios</Typography>
          <Stack spacing={2}>
            {form.servicios.map((service, index) => (
              <Paper key={`${index + 1}-service`} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Nombre del servicio"
                      value={service.nombre}
                      onChange={updateService(index, 'nombre')}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Precio"
                      value={service.precio}
                      onChange={updateService(index, 'precio')}
                      placeholder="$500 MXN"
                      fullWidth
                      required
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Duración"
                      value={service.duracion}
                      onChange={updateService(index, 'duracion')}
                      placeholder="1 hora 30 min"
                      fullWidth
                      required
                    />
                    <TextField
                      label="Rating"
                      value={service.rating}
                      onChange={updateService(index, 'rating')}
                      placeholder="4.5"
                      fullWidth
                    />
                  </Stack>

                  <TextField
                    label="Descripción del servicio"
                    value={service.descripcion}
                    onChange={updateService(index, 'descripcion')}
                    multiline
                    minRows={2}
                    fullWidth
                  />

                  <FormControlLabel
                    control={<Checkbox checked={service.es_destacado} onChange={updateServiceHighlight(index)} />}
                    label="Servicio destacado"
                  />

                  <Box>
                    <Button variant="text" color="error" disabled={form.servicios.length === 1} onClick={removeService(index)}>
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
            <TextField label="Nombre legal" value={form.nombre_legal} onChange={updateForm('nombre_legal')} fullWidth required />
            <TextField label="RFC o identificación fiscal" value={form.rfc} onChange={updateForm('rfc')} fullWidth required />
          </Stack>

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
