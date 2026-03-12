export type ServiceField = {
  code: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file';
  required?: boolean;
  options?: string[];
};

export type DurationConfig = {
  text: string;
  value: number;
};

export type ServiceConfig = {
  id: string;
  name: string;
  duration: DurationConfig;
  price: string;
  fields: ServiceField[];
};

export type ProviderSchedule = {
  openingTime: string;
  closingTime: string;
  daysOff: string[];
};

export type ProviderLegal = {
  businessName: string;
  legalRepresentative: string;
  taxId: string;
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
  complianceConfirmed: boolean;
};

export type ProviderProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  serviceCategory: string;
  about: string;
  services: ServiceConfig[];
  schedule: ProviderSchedule;
  legal?: ProviderLegal;
};

const STORAGE_KEY = 'providerProfiles';

export const defaultProviders: ProviderProfile[] = [
  {
    id: 'hello-nails',
    name: 'Hello Nails',
    city: 'Culiacán',
    state: 'Sinaloa',
    country: 'México',
    address: 'Pablo Macías Valenzuela 4465, Fracc. Jardines del Valle',
    phone: '+52 667 270 0481',
    email: 'hello-nails@example.com',
    whatsapp: '+52 667 270 0481',
    serviceCategory: 'Uñas y belleza',
    about: 'Atención detallada y productos hipoalergénicos para manos y pies.',
    services: [
      {
        id: 'acrilicas',
        name: 'Uñas acrílicas',
        duration: { text: '2 horas', value: 120 },
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
        duration: { text: '1.5 horas', value: 90 },
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
    ],
    schedule: {
      openingTime: '10:00',
      closingTime: '18:00',
      daysOff: ['lunes', 'domingo']
    }
  },
  {
    id: 'studio-bella',
    name: 'Studio Bella',
    city: 'Culiacán',
    state: 'Sinaloa',
    country: 'México',
    address: 'Av. Álvaro Obregón 1512, Centro',
    phone: '+52 667 712 1000',
    email: 'studio-bella@example.com',
    whatsapp: '+52 667 712 1000',
    serviceCategory: 'Spa y manicure',
    about: 'Especialistas en spa de manos, pedicure y tratamientos relajantes.',
    services: [
      {
        id: 'pedicure',
        name: 'Pedicure',
        duration: { text: '1 hora', value: 60 },
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
        duration: { text: '45 min', value: 45 },
        price: '$250 MXN',
        fields: [
          {
            code: 'aroma',
            label: 'Aroma preferido',
            type: 'text'
          }
        ]
      }
    ],
    schedule: {
      openingTime: '10:00',
      closingTime: '18:00',
      daysOff: ['sábado', 'domingo']
    }
  }
];

export function readProviderProfiles(): ProviderProfile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as ProviderProfile[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveProviderProfile(profile: ProviderProfile): void {
  const current = readProviderProfiles();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([profile, ...current]));
}

export function getSiteProviders(): ProviderProfile[] {
  return [...defaultProviders, ...readProviderProfiles()];
}
