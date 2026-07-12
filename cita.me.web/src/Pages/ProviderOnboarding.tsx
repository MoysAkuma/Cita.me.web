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
import { useCatProveedores } from '../hooks/Catalogues/useCatProveedores';
import { useCatEstados } from '../hooks/Catalogues/useCatEstados';
import { useCatCiudad } from '../hooks/Catalogues/useCatCiudad';

type OnboardingService = {
  name: string;
  durationText: string;
  durationValue: string;
  price: string;
  description: string;
  es_destacado?: boolean;
};

type LegalOnboardingInfo = {
  razon_social: string;
  representante_legal: string;
  rfc: string;
};

type CatalogueOption = {
  value: number;
  label: string;
};

type OnboardingForm = {
  nombre_comercial: string;
  categoria: number;
  descripcion: string;
  ciudad: number;
  estado: number;
  direccion: string;
  telefono: string;
  correo: string;
  whatsapp: string;
  dias_descanso: number[];
  hora_apertura: string;
  hora_cierre: string;
  servicios : OnboardingService[];
  datos_legales: LegalOnboardingInfo;
};

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
    correo: '',
    whatsapp: '',
    hora_apertura: '09:00',
    hora_cierre: '18:00',
    datos_legales: {
      rfc: '',
      razon_social: '',
      representante_legal: ''
    },
    servicios: [{ ...emptyService }],
    dias_descanso: []

  });
  const [daysOff, setDaysOff] = React.useState<string[]>([]);
  const [services, setServices] = React.useState<OnboardingService[]>([{ ...emptyService }]);
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

  const updateForm = (field: keyof OnboardingForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const updateLegalForm = (field: keyof LegalOnboardingInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      datos_legales: {
        ...current.datos_legales,
        [field]: event.target.value
      }
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
    form.nombre_comercial.trim() !== '' &&
    form.categoria !== 0 &&
    form.ciudad !== 0 &&
    form.estado !== 0 &&
    form.direccion.trim() !== '' &&
    form.telefono.trim() !== '' &&
    form.correo.trim() !== '' &&
    form.hora_apertura.trim() !== '' &&
    form.hora_cierre.trim() !== '';

  const isLegalInfoComplete =
    form.datos_legales.rfc.trim() !== '' &&
    form.datos_legales.razon_social.trim() !== '' &&
    form.datos_legales.representante_legal.trim() !== '' &&
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

  const getCatalogueLabel = React.useCallback((items: CatalogueOption[], value: number): string => {
    return items.find((item) => item.value === value)?.label ?? '';
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

    const providerProfile: ProviderProfile = {
      id: slugify(form.nombre_comercial),
      name: form.nombre_comercial.trim(),
      city: getCatalogueLabel(cities, form.ciudad),
      state: getCatalogueLabel(states, form.estado),
      country: 'México',
      address: form.direccion.trim(),
      phone: form.telefono.trim(),
      email: form.correo.trim(),
      whatsapp: form.whatsapp.trim(),
      serviceCategory: getCatalogueLabel(providerCategories, form.categoria),
      about: form.descripcion.trim(),
      services: mappedServices,
      schedule: {
        openingTime: form.hora_apertura,
        closingTime: form.hora_cierre,
        daysOff
      },
      legal: {
        businessName: form.datos_legales.razon_social.trim(),
        legalRepresentative: form.datos_legales.representante_legal.trim(),
        taxId: form.datos_legales.rfc.trim(),
        termsAcceptedAt: new Date().toISOString(),
        privacyAcceptedAt: new Date().toISOString(),
        complianceConfirmed: confirmCompliance
      }
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
            <TextField label="Email" type="email" value={form.correo} onChange={updateForm('correo')} fullWidth required />
            <TextField label="WhatsApp" value={form.whatsapp} onChange={updateForm('whatsapp')} fullWidth />
          </Stack>

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
            <TextField label="Razón social" value={form.datos_legales.razon_social} onChange={updateLegalForm('razon_social')} fullWidth required />
            <TextField label="Representante legal" value={form.datos_legales.representante_legal} onChange={updateLegalForm('representante_legal')} fullWidth required />
          </Stack>
          <TextField label="RFC o identificación fiscal" value={form.datos_legales.rfc} onChange={updateLegalForm('rfc')} fullWidth required />

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
