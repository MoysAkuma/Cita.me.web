type Horarios = {
  hora_apertura: string;
  hora_cierre: string;
  dia_semana: number;
  status?: string;
  disponibilidad?: string;
};

type HorarioOnboarding = {
  hora_apertura: string;
  hora_cierre: string;
  dia_semana: number;
};

type Servicio = {
  id : number;
  name: string;
  descripcion: string;
  duration: string;
  precio: string;
  rating: string;
  es_destacado: boolean;
  orden: number;
};

type ServicioOnboarding = {
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
};

type DatosLegales = {
  razon_social: string;
  representante_legal: string;
  rfc: string;
};

type SimpleCatalogue = {
  id: number;
  name: string;
}

export type OnboardingForm = {
  nombre_comercial: string;
  categoria: SimpleCatalogue;
  descripcion: string;
  ciudad: number;
  estado: number;
  direccion: string;
  codigo_postal: string;
  telefono: string;
  whatsapp: string;
  email: string;
  dias_descanso: number[];
  hora_apertura: string;
  hora_cierre: string;
  servicios: ServicioOnboarding[];
  horarios: HorarioOnboarding[];
  datos_legales: DatosLegales;
};

export type ProviderProfile = {
  id: string;
  adminId : string;
  categoria : SimpleCatalogue;
  ciudad : SimpleCatalogue;
  estado : SimpleCatalogue;
  nombre_comercial: string;
  datos_legales: DatosLegales;
  descripcion: string;
  rating : string;
  direccion: string;
  codigo_postal: string;
  telefono: string;
  whatsapp: string;
  email : string;
  horario : Horarios[];
  servicios : Servicio[];
};

export type GetSiteProviders = () => ProviderProfile[];

export const defaultProviders: ProviderProfile[] = [
  {
    id: '44b0b79e-6308-41a6-8dec-c40f8539c37b',
    nombre_comercial: 'Hello Nails',
    ciudad: { id: 1, name: 'Ciudad Name' },
    estado: { id: 1, name: 'Estado Name' },
    direccion: 'Pablo Macías Valenzuela 4465, Fracc. Jardines del Valle',
    telefono: '+52 667 270 0481',
    adminId: 'admin-44b0b79e-6308-41a6-8dec-c40f8539c37b',
    email: 'hello-nails@example.com',
    whatsapp: '+52 667 270 0481',
    categoria: { id: 1, name: 'Categoria Name' },
    datos_legales: {
      razon_social: 'Hello Nails S.A. de C.V.',
      representante_legal: 'Juan Pérez',
      rfc: 'HNA123456789'
    },
    codigo_postal: '21100',
    rating: '4.5',
    descripcion: 'Atención detallada y productos hipoalergénicos para manos y pies.',
    servicios: [
      {
        id: 1,
        name: 'Uñas acrílicas',
        duration: '2 horas',
        precio: '$500 MXN',
        descripcion: 'Aplicación de uñas acrílicas con diseño personalizado.',
        rating: '4.5',
        es_destacado: true,
        orden: 1
      },
      {
        id: 2,
        name: 'Gelish',
        duration: '1.5 horas',
        precio: '$400 MXN',
        descripcion: 'Aplicación de esmalte en gel.',
        rating: '4.0',
        es_destacado: false,
        orden: 2
      }
    ],
    horario: [
      {
        hora_apertura: '10:00',
        hora_cierre: '18:00',
        dia_semana: 1,
        status: 'activo',
        disponibilidad: 'disponible'
      },
      {
        hora_apertura: '10:00',
        hora_cierre: '18:00',
        dia_semana: 7,
        status: 'activo',
        disponibilidad: 'disponible'
      }
    ]
  }
];

export const getSiteProviders: GetSiteProviders = () => {
  return [...defaultProviders];
};

export type FiltersFetch = { categoria?: number; ciudad?: number; estado?: number };