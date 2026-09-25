export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO';

export interface TurnoAuxiliar {
  id: number;
  dia: DiaSemana;
  horarioInicio: string;
  horarioFin: string;
}

export interface Perfil {
  id: number;
  codigoSiss: string;
  nombreCompleto: string;
  cargo: string;
  rol: string;

  // Se mantienen temporalmente como respaldo
  horarioInicio: string;
  horarioFin: string;

  activo: boolean;
  turnos: TurnoAuxiliar[];
}

const API_URL = 'http://localhost:3000/api';

export async function obtenerPerfil(): Promise<Perfil> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No existe una sesión activa');
  }

  const response = await fetch(`${API_URL}/perfil`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudo obtener el perfil');
  }

  return data;
}