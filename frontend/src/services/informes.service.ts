export interface ResumenInforme {
  id: number;
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  horarioModificado: boolean;
  estado: string;
  estadoRecomendacion: string | null;
  createdAt: string;

  _count: {
    actividadesAcademicas: number;
    actividadesLaboratorio: number;
    incidencias: number;
    pendientes: number;
  };
}

export interface ActividadAcademicaPayload {
  sala: string;

  docenteId?: number | null;
  docenteOtro?: string | null;

  materiaId?: number | null;
  materiaOtra?: string | null;

  horarioInicio: string;
  horarioFin: string;

  observaciones?: string | null;
}

export interface IncidenciaPayload {
  equipo: string;
  descripcion: string;
  accion: string;
}

export interface CrearInformePayload {
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  horarioModificado: boolean;

  actividadesAcademicas: ActividadAcademicaPayload[];

  actividadesLaboratorio: string[];

  incidencias: IncidenciaPayload[];

  pendientes: string[];

  estadoRecomendacion: string | null;
}

export interface UsuarioInforme {
  id: number;
  codigoSiss: string;
  nombreCompleto: string;
  cargo: string;
}

export interface ActividadAcademicaDetalle {
  id: number;
  sala: string;

  docenteId?: number | null;
  docenteOtro?: string | null;

  materiaId?: number | null;
  materiaOtra?: string | null;

  horarioInicio: string;
  horarioFin: string;

  observaciones?: string | null;

  docente?: {
    id?: number;
    nombre?: string;
    nombreCompleto?: string;
  } | null;

  materia?: {
    id?: number;
    nombre?: string;
  } | null;
}

export interface ActividadLaboratorioDetalle {
  id: number;
  descripcion: string;
  orden: number;
}

export interface IncidenciaDetalle {
  id: number;
  equipo: string;
  descripcion: string;
  accion: string;
}

export interface PendienteDetalle {
  id: number;
  descripcion: string;
  orden: number;
}

export interface InformeDetalle {
  id: number;
  fecha: string;

  horarioInicio: string;
  horarioFin: string;

  horarioModificado: boolean;

  estado: string;

  estadoRecomendacion: string | null;

  usuario: UsuarioInforme;

  actividadesAcademicas: ActividadAcademicaDetalle[];

  actividadesLaboratorio: ActividadLaboratorioDetalle[];

  incidencias: IncidenciaDetalle[];

  pendientes: PendienteDetalle[];
}

interface RespuestaGuardarInforme {
  mensaje: string;

  informe: {
    id: number;
  };
}

const API_URL = 'http://localhost:3000/api';

function obtenerToken(): string {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No existe una sesión activa');
  }

  return token;
}

export async function obtenerInformes(): Promise<ResumenInforme[]> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/informes`, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener los informes'
    );
  }

  return data;
}

export async function obtenerInformePorId(
  id: string | number
): Promise<InformeDetalle> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/informes/${id}`, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo obtener el informe'
    );
  }

  return data;
}

export async function crearInforme(
  informe: CrearInformePayload
): Promise<RespuestaGuardarInforme> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/informes`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(informe),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo guardar el informe'
    );
  }

  return data;
}

export async function actualizarInforme(
  id: string | number,
  informe: CrearInformePayload
): Promise<RespuestaGuardarInforme> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/informes/${id}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(informe),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo actualizar el informe'
    );
  }

  return data;
}

export function contarActividades(
  informe: ResumenInforme
): number {
  return (
    informe._count.actividadesAcademicas +
    informe._count.actividadesLaboratorio
  );
}

export function obtenerHorario(
  informe: ResumenInforme
): string {
  return `${informe.horarioInicio} - ${informe.horarioFin}`;
}