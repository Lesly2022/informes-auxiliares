const API_URL = 'http://localhost:3000/api';

// ==========================================
// TIPOS - DASHBOARD
// ==========================================

export interface AdminDashboardResumen {
  totalInformes: number;
  totalAuxiliares: number;
  auxiliaresActivos: number;
  totalDocentes: number;
  totalSalas: number;
}

export interface AdminInformeResumen {
  id: number;
  usuarioId: number;
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  horarioModificado: boolean;
  estado: string;
  estadoRecomendacion: string | null;
  createdAt: string;
  updatedAt: string;

  usuario: {
    id: number;
    nombreCompleto: string;
    codigoSiss: string | null;
  };
}

export interface AdminDashboardResponse {
  resumen: AdminDashboardResumen;
  informesRecientes: AdminInformeResumen[];
}

// ==========================================
// TIPOS - AUXILIARES
// ==========================================

export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO';

export interface AdminTurnoAuxiliar {
  id?: number;
  dia: DiaSemana;
  horarioInicio: string;
  horarioFin: string;
}

export interface AdminAuxiliar {
  id: number;
  nombreCompleto: string;
  codigoSiss: string;
  carnet: string;
  cargo: string;

  // Se mantienen temporalmente mientras terminamos la migración.
  horarioInicio: string;
  horarioFin: string;

  activo: boolean;
  turnos: AdminTurnoAuxiliar[];
}

export interface AdminAuxiliarFormulario {
  nombreCompleto: string;
  codigoSiss: string;
  carnet: string;
  cargo: string;
  turnos: AdminTurnoAuxiliar[];
}

// ==========================================
// TIPOS - DETALLE DE INFORME
// ==========================================

export interface AdminInformeDetalle {
  id: number;
  usuarioId: number;
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  horarioModificado: boolean;
  estado: string;
  estadoRecomendacion: string | null;
  createdAt: string;
  updatedAt: string;

  usuario: {
    id: number;
    codigoSiss: string | null;
    username: string | null;
    nombreCompleto: string;
    cargo: string;
    rol: string;
    horarioInicio: string;
    horarioFin: string;
    activo: boolean;
  };

  actividadesAcademicas: {
    id: number;
    informeId: number;
    docenteId: number | null;
    docenteOtro: string | null;
    materiaId: number | null;
    materiaOtra: string | null;
    sala: string;
    horarioInicio: string;
    horarioFin: string;
    observaciones: string | null;

    docente: {
      id: number;
      nombreCompleto: string;
      activo: boolean;
    } | null;

    materia: {
      id: number;
      codigo: string | null;
      nombre: string;
      activo: boolean;
    } | null;
  }[];

  actividadesLaboratorio: {
    id: number;
    informeId: number;
    descripcion: string;
    orden: number;
  }[];

  incidencias: {
    id: number;
    informeId: number;
    equipo: string;
    descripcion: string;
    accion: string;
  }[];

  pendientes: {
    id: number;
    informeId: number;
    descripcion: string;
    orden: number;
  }[];
}

// ==========================================
// FILTROS DE INFORMES
// ==========================================

export interface AdminFiltrosInformes {
  auxiliarId?: number;
  fecha?: string;
  mes?: number;
  anio?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

// ==========================================
// TOKEN
// ==========================================

function obtenerToken(): string {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No existe una sesión activa');
  }

  return token;
}

// ==========================================
// DASHBOARD
// ==========================================

export async function obtenerAdminDashboard(): Promise<AdminDashboardResponse> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener los datos del dashboard'
    );
  }

  return data;
}

// ==========================================
// AUXILIARES - LISTAR
// ==========================================

export async function obtenerAdminAuxiliares(): Promise<AdminAuxiliar[]> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/auxiliares`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener los auxiliares'
    );
  }

  return data;
}

// ==========================================
// AUXILIARES - CREAR
// ==========================================

export async function crearAdminAuxiliar(
  auxiliar: AdminAuxiliarFormulario
): Promise<AdminAuxiliar> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/auxiliares`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(auxiliar),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo registrar el auxiliar'
    );
  }

  return data;
}

// ==========================================
// AUXILIARES - EDITAR
// ==========================================

export async function actualizarAdminAuxiliar(
  id: number,
  auxiliar: AdminAuxiliarFormulario
): Promise<AdminAuxiliar> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/auxiliares/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(auxiliar),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo actualizar el auxiliar'
    );
  }

  return data;
}

// ==========================================
// AUXILIARES - ACTIVAR / DESACTIVAR
// ==========================================

export async function cambiarEstadoAdminAuxiliar(
  id: number,
  activo: boolean
): Promise<AdminAuxiliar> {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/auxiliares/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activo }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo cambiar el estado del auxiliar'
    );
  }

  return data;
}

// ==========================================
// TIPOS - DOCENTES
// ==========================================

export interface AdminDocente {
  id: number;
  nombreCompleto: string;
  activo: boolean;
}

// ==========================================
// DOCENTES - LISTAR
// ==========================================

export async function obtenerAdminDocentes(): Promise<AdminDocente[]> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/docentes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener los docentes'
    );
  }

  return data;
}

// ==========================================
// DOCENTES - CREAR
// ==========================================

export async function crearAdminDocente(
  nombreCompleto: string
): Promise<AdminDocente> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/docentes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombreCompleto }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo registrar el docente'
    );
  }

  return data;
}

// ==========================================
// DOCENTES - EDITAR
// ==========================================

export async function actualizarAdminDocente(
  id: number,
  nombreCompleto: string
): Promise<AdminDocente> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/docentes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombreCompleto }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo actualizar el docente'
    );
  }

  return data;
}

// ==========================================
// DOCENTES - ACTIVAR / DESACTIVAR
// ==========================================

export async function cambiarEstadoAdminDocente(
  id: number,
  activo: boolean
): Promise<AdminDocente> {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/docentes/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activo }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo cambiar el estado del docente'
    );
  }

  return data;
}

// ==========================================
// TIPOS - SALAS
// ==========================================

export interface AdminSala {
  id: number;
  nombre: string;
  activo: boolean;
}

// ==========================================
// SALAS - LISTAR
// ==========================================

export async function obtenerAdminSalas(): Promise<AdminSala[]> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/salas`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener las salas'
    );
  }

  return data;
}

// ==========================================
// SALAS - CREAR
// ==========================================

export async function crearAdminSala(
  nombre: string
): Promise<AdminSala> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/salas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo registrar la sala'
    );
  }

  return data;
}

// ==========================================
// SALAS - EDITAR
// ==========================================

export async function actualizarAdminSala(
  id: number,
  nombre: string
): Promise<AdminSala> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/salas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo actualizar la sala'
    );
  }

  return data;
}

// ==========================================
// SALAS - ACTIVAR / DESACTIVAR
// ==========================================

export async function cambiarEstadoAdminSala(
  id: number,
  activo: boolean
): Promise<AdminSala> {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/salas/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activo }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo cambiar el estado de la sala'
    );
  }

  return data;
}

// ==========================================
// TIPOS - MATERIAS
// ==========================================

export interface AdminMateria {
  id: number;
  codigo: string | null;
  nombre: string;
  activo: boolean;
}

// ==========================================
// MATERIAS - LISTAR
// ==========================================

export async function obtenerAdminMaterias(): Promise<AdminMateria[]> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/materias`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener las materias'
    );
  }

  return data;
}

// ==========================================
// MATERIAS - CREAR
// ==========================================

export async function crearAdminMateria(
  codigo: string,
  nombre: string
): Promise<AdminMateria> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/materias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ codigo, nombre }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo registrar la materia'
    );
  }

  return data;
}

// ==========================================
// MATERIAS - EDITAR
// ==========================================

export async function actualizarAdminMateria(
  id: number,
  codigo: string,
  nombre: string
): Promise<AdminMateria> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/materias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ codigo, nombre }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo actualizar la materia'
    );
  }

  return data;
}

// ==========================================
// MATERIAS - ACTIVAR / DESACTIVAR
// ==========================================

export async function cambiarEstadoAdminMateria(
  id: number,
  activo: boolean
): Promise<AdminMateria> {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/materias/${id}/estado`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activo }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo cambiar el estado de la materia'
    );
  }

  return data;
}

// ==========================================
// INFORMES
// ==========================================

export async function obtenerAdminInformes(
  filtros: AdminFiltrosInformes = {}
): Promise<AdminInformeResumen[]> {
  const token = obtenerToken();

  const params = new URLSearchParams();

  if (filtros.auxiliarId !== undefined) {
    params.set('auxiliarId', String(filtros.auxiliarId));
  }

  if (filtros.fecha) {
    params.set('fecha', filtros.fecha);
  }

  if (filtros.mes !== undefined) {
    params.set('mes', String(filtros.mes));
  }

  if (filtros.anio !== undefined) {
    params.set('anio', String(filtros.anio));
  }

  if (filtros.fechaDesde) {
    params.set('fechaDesde', filtros.fechaDesde);
  }

  if (filtros.fechaHasta) {
    params.set('fechaHasta', filtros.fechaHasta);
  }

  const query = params.toString();

  const url = query
    ? `${API_URL}/admin/informes?${query}`
    : `${API_URL}/admin/informes`;

  const response = await fetch(url, {
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

// ==========================================
// DETALLE DE INFORME
// ==========================================

export async function obtenerAdminInformePorId(
  id: string | number
): Promise<AdminInformeDetalle> {
  const token = obtenerToken();

  const response = await fetch(`${API_URL}/admin/informes/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudo obtener el detalle del informe'
    );
  }

  return data;
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

export function formatearFechaAdmin(fecha: string): string {
  if (!fecha) {
    return '';
  }

  const parteFecha = fecha.substring(0, 10);
  const [anio, mes, dia] = parteFecha.split('-');

  if (!anio || !mes || !dia) {
    return fecha;
  }

  return `${dia}/${mes}/${anio}`;
}

export function obtenerHorarioAdmin(
  informe: Pick<AdminInformeResumen, 'horarioInicio' | 'horarioFin'>
): string {
  return `${informe.horarioInicio} - ${informe.horarioFin}`;
}