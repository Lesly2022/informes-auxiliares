import type { Informe, Usuario } from './types';

export const USUARIO: Usuario = {
  nombre: 'Jose Alejandro Montaño Laura',
  cargo: 'Auxiliar de Laboratorio de Cómputo',
  codigoSiss: '202001823',
  carnet: '8018935',
};

export const HORARIO_TURNO_DEFAULT = '09:00 - 13:00';

export const MOCK_REPORTS: Informe[] = [
  {
    id: '1',
    fecha: '2026-09-05',
    horario: '09:00 - 13:00',
    actividadesAcademicas: [
      {
        id: 'a1',
        sala: 'Sala 2',
        docente: 'Lic. Tatiana Aparicio',
        docenteOtro: '',
        materia: 'Base de Datos I',
        materiaOtra: '',
        horario: '09:45 - 11:15',
        observaciones: 'Clase práctica sin novedades.',
      },
      {
        id: 'a2',
        sala: 'Sala 1',
        docente: 'Lic. Marcelo Antezana',
        docenteOtro: '',
        materia: 'Informática Forense',
        materiaOtra: '',
        horario: '11:15 - 12:45',
        observaciones: '',
      },
    ],
    actividadesLaboratorio: [
      'Revisión de los equipos de la Sala 1 antes del inicio de clases. Se verificó el funcionamiento de los 25 equipos.',
      'Instalación de actualizaciones de seguridad en 10 computadoras de la Sala 3.',
      'Apoyo a estudiantes durante la práctica de Base de Datos I en Sala 2.',
      'Organización y limpieza general del Laboratorio de Redes al finalizar el turno.',
    ],
    incidencias: [
      {
        id: 'i1',
        equipo: 'PC-15 / Sala 2',
        descripcion: 'El equipo no iniciaba correctamente, mostraba pantalla azul al arrancar.',
        accion: 'Se realizó una verificación del disco duro y se restauró el sistema operativo desde punto de restauración. El equipo quedó operativo.',
      },
    ],
    pendientes: [
      'Completar la instalación de actualizaciones en los 15 equipos restantes de la Sala 3.',
      'Solicitar repuesto para el teclado dañado de la PC-08 en Sala 1.',
    ],
    estadoRecomendacion: 'Los laboratorios se encuentran en buen estado. Se recomienda continuar con las actualizaciones pendientes de Sala 3.',
    estado: 'Guardado',
  },
  {
    id: '2',
    fecha: '2026-09-03',
    horario: '09:00 - 13:00',
    actividadesAcademicas: [
      {
        id: 'a3',
        sala: 'Sala 3',
        docente: 'Lic. Jimmy Villarroel',
        docenteOtro: '',
        materia: 'Métodos, Técnicas y Taller de Programación',
        materiaOtra: '',
        horario: '09:45 - 11:15',
        observaciones: '',
      },
      {
        id: 'a4',
        sala: 'Sala 4',
        docente: 'Lic. Tatiana Aparicio',
        docenteOtro: '',
        materia: 'Base de Datos I',
        materiaOtra: '',
        horario: '11:15 - 12:45',
        observaciones: 'La docente solicitó apoyo para instalar extensión de VS Code.',
      },
    ],
    actividadesLaboratorio: [
      'Apertura y preparación de los laboratorios al inicio del turno.',
      'Configuración del proyector de la Sala 3 para la clase de programación.',
      'Apoyo técnico a la docente en Sala 4 con la instalación de extensiones.',
      'Revisión general de los equipos de la Sala 2.',
      'Mantenimiento básico de teclados y ratones en Sala 1.',
      'Cierre y verificación de seguridad de todos los laboratorios al finalizar el turno.',
    ],
    incidencias: [],
    pendientes: ['Reportar el estado del proyector de Sala 1, que presenta fallas de color.'],
    estadoRecomendacion: 'Todo en orden. El proyector de Sala 1 debe revisarse con prioridad.',
    estado: 'Guardado',
  },
  {
    id: '3',
    fecha: '2026-09-01',
    horario: '09:00 - 13:00',
    actividadesAcademicas: [],
    actividadesLaboratorio: [
      'Revisión completa de los 4 laboratorios al inicio de la semana.',
      'Actualización de software en todos los equipos del Laboratorio de Redes.',
      'Reorganización del cableado en el Laboratorio de Redes para mejorar el orden.',
    ],
    incidencias: [
      {
        id: 'i2',
        equipo: 'Switch principal / Lab. Redes',
        descripcion: 'El switch principal presentó sobrecalentamiento durante la mañana.',
        accion: 'Se apagó el dispositivo por 20 minutos para que se enfriara y se mejoró la ventilación del rack. Se dejó funcionando correctamente.',
      },
    ],
    pendientes: [],
    estadoRecomendacion: 'Se sugiere revisar el sistema de ventilación del rack en el Laboratorio de Redes.',
    estado: 'Guardado',
  },
];

export const SALAS = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Laboratorio de Redes'];

export const DOCENTES = [
  'Lic. Tatiana Aparicio',
  'Lic. Marcelo Antezana',
  'Lic. Jimmy Villarroel',
  'Otro',
];

export const MATERIAS = [
  'Base de Datos I',
  'Informática Forense',
  'Métodos, Técnicas y Taller de Programación',
  'Otra',
];

export const HORARIOS_ACADEMICOS = [
  '06:45 - 08:15',
  '08:15 - 09:45',
  '09:45 - 11:15',
  '11:15 - 12:45',
  '12:45 - 14:15',
  '14:15 - 15:45',
  '15:45 - 17:15',
  '17:15 - 18:45',
  '18:45 - 20:15',
  '20:15 - 21:45',
];

export const HORARIOS_TURNO_ALTERNATIVOS: string[] = [
  '06:45 - 14:15',
  '07:00 - 11:00',
  '08:00 - 12:00',
  '09:00 - 13:00',
  '10:00 - 14:00',
  '14:00 - 18:00',
  '14:15 - 21:45',
  '18:00 - 22:00',
];

export function formatFecha(fechaISO: string): string {
  if (!fechaISO) return '—';
  const [y, m, d] = fechaISO.split('-');
  return `${d}/${m}/${y}`;
}

export function countActividades(informe: Informe): number {
  return informe.actividadesLaboratorio.filter(a => a.trim()).length;
}
