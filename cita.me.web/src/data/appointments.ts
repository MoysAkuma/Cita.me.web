export type SolictudCitaForm = {
    proveedor_id: string;
    servicio_id: number;
    fecha_solicitada: string;
    hora_solicitada: string;
    sucursal_id?: number;
    user_id?: string;
    nombre_solicitante?: string;
    whatsapp_solicitante?: string;
    correo_solicitante?: string;
    notas?: string;
};

export type ConfirmacionCitaForm = {
    usuario_id: string;
    proveedor_id: string;
    servicio_id: number;
    telefono_whatsapp: string;
};

type CronologiaCita = {
    creacion: string;
    solicitud: string;
    confirmacion: string;
    finalizacion: string;
    inicio: string;
    completado: string;
};

type ProveedorInfo = {
    id: string;
    nombre: string;
}

type UsuarioInfo = {
    id: string;
    nombre: string;
}

type ServicioInfo = {
    id: number;
    nombre: string;
    precio: number;
}

type SucursalInfo = {
    id: number;
    nombre: string;
    direccion: string;
}
export type Appointment = {
    id: string;
    proveedor: ProveedorInfo;
    usuario?: UsuarioInfo;
    servicio: ServicioInfo;
    sucursal?: SucursalInfo;
    nombre_solicitante: string;
    whatsapp_solicitante: string;
    correo_solicitante: string;
    cronologia: CronologiaCita;
    status: string;
    notas?: string;
    calificacion?: number;
};

export type GetCitasResponse = () => Appointment[];