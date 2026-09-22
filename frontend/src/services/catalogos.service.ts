const API_URL = 'http://localhost:3000/api';

export interface Sala {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Docente {
  id: number;
  nombreCompleto: string;
  activo: boolean;
}

export interface Materia {
  id: number;
  codigo: string | null;
  nombre: string;
  activo: boolean;
}

// ================================
// SALAS ACTIVAS
// ================================

export async function obtenerSalas(): Promise<Sala[]> {
  const response = await fetch(`${API_URL}/salas`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener las salas'
    );
  }

  return data;
}

// ================================
// DOCENTES ACTIVOS
// ================================

export async function obtenerDocentes(): Promise<Docente[]> {
  const response = await fetch(`${API_URL}/docentes`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener los docentes'
    );
  }

  return data;
}

// ================================
// MATERIAS ACTIVAS
// ================================

export async function obtenerMaterias(): Promise<Materia[]> {
  const response = await fetch(`${API_URL}/materias`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || 'No se pudieron obtener las materias'
    );
  }

  return data;
}