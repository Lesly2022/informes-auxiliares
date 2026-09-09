export interface ActividadAcademica {
  id: string;
  sala: string;
  docente: string;
  docenteOtro: string;
  materia: string;
  materiaOtra: string;
  horario: string;
  observaciones: string;
}

export interface Incidencia {
  id: string;
  equipo: string;
  descripcion: string;
  accion: string;
}

export interface Informe {
  id: string;
  fecha: string;
  horario: string;
  actividadesAcademicas: ActividadAcademica[];
  actividadesLaboratorio: string[];
  incidencias: Incidencia[];
  pendientes: string[];
  estadoRecomendacion: string;
  estado: 'Guardado';
}

export interface Usuario {
  nombre: string;
  cargo: string;
  codigoSiss: string;
  carnet: string;
}

export type Screen = 'login' | 'dashboard' | 'elaborar' | 'informes' | 'visualizar' | 'editar';
