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
import { useCatProveedores } from '../hooks/Catalogues/useCatProveedores';
import { useCatEstados } from '../hooks/Catalogues/useCatEstados';
import { useCatCiudad } from '../hooks/Catalogues/useCatCiudad';
import { useOnboarding } from '../hooks/Provider/useOnboarding';
import { useAuth } from '../contexts/AuthContext';

type CatalogueOption = {
  id: number;
  name: string;
};

type OnboardingService = {
  nombre: string;
  descripcion: string;
  duracion: string;
  precio: string;
  rating: string;
  es_destacado: boolean;
  orden: number;
};

type OnboardingForm = {
  nombre_comercial: string;
  categoria: CatalogueOption;
  descripcion: string;
  ciudad: CatalogueOption;
  estado: CatalogueOption;
  direccion: string;
  codigo_postal: string;
  telefono: string;
  whatsapp: string;
  email: string;
  nombre_legal: string;
  representante_legal: string;
  rfc: string;
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
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  rating: '0.0',
  es_destacado: false,
  orden: 1
};

const emptyCatalogueOption: CatalogueOption = {
  id: 0,
  name: ''
};

export default function ProviderOnboarding(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onboard, loading, error } = useOnboarding(user?.id ?? '');
  const { getProveedores } = useCatProveedores();
  const { getEstados } = useCatEstados();
  const { getCiudades } = useCatCiudad();
  const hasLoadedCatalogues = React.useRef(false);
  const [form, setForm] = React.useState<OnboardingForm>({
    nombre_comercial: '',
    categoria: emptyCatalogueOption,
    descripcion: '',
    ciudad: emptyCatalogueOption,
    estado: emptyCatalogueOption,
    direccion: '',
    telefono: '',
    email: '',
    whatsapp: '',
    nombre_legal: '',
    representante_legal: '',
    rfc: '',
    codigo_postal: '',
    hora_apertura: '09:00',
    hora_cierre: '18:00',
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
            id: value,
            name: String(label)
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
      const selectedId = Number(event.target.value);
      const optionsByField: Record<'categoria' | 'estado' | 'ciudad', CatalogueOption[]> = {
        categoria: providerCategories,
        estado: states,
        ciudad: cities
      };
      const selectedOption = optionsByField[field].find((option) => option.id === selectedId) ?? {
        id: selectedId,
        name: ''
      };

      setForm((current) => ({
        ...current,
        [field]: selectedOption
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
          orden: serviceIndex + 1
        }))
    }));
  };

  const isBaseInfoComplete =
    form.nombre_comercial.trim() !== '' &&
    form.categoria.id !== 0 &&
    form.ciudad.id !== 0 &&
    form.estado.id !== 0 &&
    form.direccion.trim() !== '' &&
    form.codigo_postal.trim() !== '' &&
    form.telefono.trim() !== '' &&
    form.email.trim() !== '' &&
    form.hora_apertura.trim() !== '' &&
    form.hora_cierre.trim() !== '';

  const isLegalInfoComplete =
    form.nombre_legal.trim() !== '' &&
    form.rfc.trim() !== '' &&
    acceptTerms &&
    acceptPrivacy &&
    confirmCompliance;

  const hasValidServices =
    form.servicios.length > 0 &&
    form.servicios.every(
      (service) =>
        service.nombre.trim() !== '' &&
        Number(service.duracion) > 0 &&
        Number(service.precio) > 0
    );

  const canSubmit = isBaseInfoComplete && isLegalInfoComplete && hasValidServices;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      setErrorMessage('Debes iniciar sesión para completar el onboarding.');
      return;
    }

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

    const mappedServices = form.servicios.map((service) => ({
      nombre: service.nombre.trim(),
      descripcion: service.descripcion.trim(),
      duracion: Number(service.duracion),
      precio: Number(service.precio)
    }));

    await onboard({
      nombre_comercial: form.nombre_comercial.trim(),
      categoria: form.categoria.id,
      descripcion: form.descripcion.trim(),
      ciudad: form.ciudad.id,
      estado: form.estado.id,
      direccion: form.direccion.trim(),
      codigo_postal: form.codigo_postal.trim(),
      telefono: form.telefono.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      dias_descanso: form.dias_descanso,
      hora_apertura: form.hora_apertura,
      hora_cierre: form.hora_cierre,
      servicios: mappedServices,
      datos_legales: {
        razon_social: form.nombre_legal.trim(),
        representante_legal: form.representante_legal.trim(),
        rfc: form.rfc.trim()
      }
    });
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

          {(errorMessage || error) && <Alert severity="error">{errorMessage || error}</Alert>}

          <Typography variant="h6">Información del negocio</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Nombre comercial" value={form.nombre_comercial} onChange={updateForm('nombre_comercial')} fullWidth required />
            <TextField select label="Categoría de servicio" value={form.categoria.id} onChange={updateNumericForm('categoria')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona una categoría
              </MenuItem>
              {providerCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField label="Descripción del negocio" value={form.descripcion} onChange={updateForm('descripcion')} multiline minRows={3} fullWidth />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField select label="Ciudad" value={form.ciudad.id} onChange={updateNumericForm('ciudad')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona una ciudad
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Estado" value={form.estado.id} onChange={updateNumericForm('estado')} fullWidth required>
              <MenuItem value={0} disabled>
                Selecciona un estado
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField label="Dirección" value={form.direccion} onChange={updateForm('direccion')} fullWidth required />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Teléfono" value={form.telefono} onChange={updateForm('telefono')} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={updateForm('email')} fullWidth required />
            <TextField label="WhatsApp" value={form.whatsapp} onChange={updateForm('whatsapp')} fullWidth />
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
                      type="number"
                      value={service.precio}
                      onChange={updateService(index, 'precio')}
                      placeholder="500"
                      fullWidth
                      required
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Duración (minutos)"
                      type="number"
                      value={service.duracion}
                      onChange={updateService(index, 'duracion')}
                      placeholder="60"
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
            <TextField label="Representante legal" value={form.representante_legal} onChange={updateForm('representante_legal')} fullWidth />
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
            <Button variant="contained" type="submit" disabled={!canSubmit || loading} fullWidth>
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
