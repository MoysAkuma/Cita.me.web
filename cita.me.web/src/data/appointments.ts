export type SolictudCitaForm = {
    proveedorId: string;
    servicioId: number;
    sucursalId?: number;
    userId?: string;
    nombreSolicitante: string;
    whatsappSolicitante: string;
    correoSolicitante: string;
    fechaSolicitada: string;
    notas?: string;
};

export type ConfirmacionCitaForm = {
    usuarioId: string;
    proveedorId: string;
    servicioId: string;
    telefonoWhatsapp: string;
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
    proveedor_id: ProveedorInfo;
    usuario_id?: UsuarioInfo;
    servicio_id: ServicioInfo;
    sucursal_id?: SucursalInfo;
    nombre_solicitante: string;
    whatsapp_solicitante: string;
    correo_solicitante: string;
    cronologia: CronologiaCita;
    status: string;
    notas?: string;
    calificacion?: number;
};

export type GetCitasResponse = () => Appointment[];