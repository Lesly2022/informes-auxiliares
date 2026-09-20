import AdminSidebar from '../../components/AdminSidebar';
import type { AdminScreen } from '../../types';

interface Props {
  informeId: string;
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

interface ActividadAcademicaAdmin {
  sala: string;
  docente: string;
  materia: string;
  horario: string;
  observaciones: string;
}

interface IncidenciaAdmin {
  equipo: string;
  descripcion: string;
  accion: string;
}

interface InformeDetalleAdmin {
  id: number;
  fecha: string;
  auxiliar: string;
  codigoSiss: string;
  cargo: string;
  horarioInicio: string;
  horarioFin: string;
  actividadesAcademicas: ActividadAcademicaAdmin[];
  actividadesLaboratorio: string[];
  incidencias: IncidenciaAdmin[];
  pendientes: string[];
  estadoRecomendacion: string;
  estado: 'GUARDADO';
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#eef4ff';

/*
 * DATOS TEMPORALES DEL FRONTEND
 *
 * Más adelante serán reemplazados por:
 * GET /api/admin/informes/:id
 */
const informesDetalle: InformeDetalleAdmin[] = [
  {
    id: 1,
    fecha: '2026-09-20',
    auxiliar: 'José Alejandro Montaño Laura',
    codigoSiss: '202001823',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    actividadesAcademicas: [
      {
        sala: 'Laboratorio 1',
        docente: 'Ing. María Rodríguez',
        materia: 'Programación I',
        horario: '09:00 - 10:30',
        observaciones: 'La clase se desarrolló con normalidad.',
      },
      {
        sala: 'Laboratorio 2',
        docente: 'Ing. Carlos Fernández',
        materia: 'Base de Datos I',
        horario: '10:30 - 12:00',
        observaciones: 'Se brindó apoyo durante la práctica de laboratorio.',
      },
    ],
    actividadesLaboratorio: [
      'Verificación del funcionamiento de los equipos.',
      'Apoyo a estudiantes durante las prácticas.',
      'Revisión del estado de los periféricos.',
      'Organización de los laboratorios al finalizar las clases.',
    ],
    incidencias: [
      {
        equipo: 'PC-12',
        descripcion: 'El equipo presentó problemas de conexión a la red.',
        accion: 'Se verificó el cableado y se restableció la conexión.',
      },
    ],
    pendientes: [
      'Realizar seguimiento al equipo PC-12.',
    ],
    estadoRecomendacion:
      'Se recomienda realizar una revisión preventiva de los equipos del Laboratorio 1.',
    estado: 'GUARDADO',
  },
  {
    id: 2,
    fecha: '2026-09-20',
    auxiliar: 'María Fernanda López',
    codigoSiss: '202002145',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '13:00',
    horarioFin: '17:00',
    actividadesAcademicas: [
      {
        sala: 'Laboratorio 2',
        docente: 'Lic. Ana María Vargas',
        materia: 'Introducción a la Informática',
        horario: '13:00 - 14:30',
        observaciones: 'Clase desarrollada sin inconvenientes.',
      },
    ],
    actividadesLaboratorio: [
      'Encendido y verificación de equipos.',
      'Asistencia a estudiantes.',
      'Control de acceso al laboratorio.',
    ],
    incidencias: [],
    pendientes: [],
    estadoRecomendacion:
      'Los laboratorios quedaron en condiciones normales de funcionamiento.',
    estado: 'GUARDADO',
  },
  {
    id: 3,
    fecha: '2026-09-19',
    auxiliar: 'Carlos Mendoza Rojas',
    codigoSiss: '202003254',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '08:00',
    horarioFin: '12:00',
    actividadesAcademicas: [
      {
        sala: 'Laboratorio 1',
        docente: 'Ing. Roberto Flores',
        materia: 'Ingeniería de Software',
        horario: '08:00 - 09:30',
        observaciones: 'Se prepararon los equipos antes del ingreso del curso.',
      },
      {
        sala: 'Laboratorio 3',
        docente: 'Ing. Patricia Rojas',
        materia: 'Sistemas de Información',
        horario: '10:00 - 11:30',
        observaciones: 'Se brindó asistencia técnica durante la clase.',
      },
    ],
    actividadesLaboratorio: [
      'Revisión de equipos.',
      'Preparación de laboratorios.',
      'Asistencia técnica a docentes.',
      'Control de estudiantes.',
      'Apagado de equipos.',
    ],
    incidencias: [
      {
        equipo: 'PC-05',
        descripcion: 'El teclado presentó fallas en algunas teclas.',
        accion: 'Se reemplazó temporalmente el teclado.',
      },
    ],
    pendientes: [
      'Solicitar un teclado de reemplazo para PC-05.',
    ],
    estadoRecomendacion:
      'Se recomienda sustituir definitivamente el teclado reportado.',
    estado: 'GUARDADO',
  },
  {
    id: 4,
    fecha: '2026-09-19',
    auxiliar: 'Andrea Vargas Flores',
    codigoSiss: '202004321',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '14:00',
    horarioFin: '18:00',
    actividadesAcademicas: [
      {
        sala: 'Laboratorio 2',
        docente: 'Ing. Marco Antonio Pérez',
        materia: 'Redes',
        horario: '14:00 - 16:00',
        observaciones: 'La actividad académica se desarrolló normalmente.',
      },
    ],
    actividadesLaboratorio: [
      'Control del laboratorio.',
      'Verificación de equipos al cierre del turno.',
    ],
    incidencias: [],
    pendientes: [],
    estadoRecomendacion: 'Sin recomendaciones adicionales.',
    estado: 'GUARDADO',
  },
  {
    id: 5,
    fecha: '2026-09-18',
    auxiliar: 'Luis Fernando Rocha',
    codigoSiss: '202005678',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    actividadesAcademicas: [
      {
        sala: 'Laboratorio 3',
        docente: 'Ing. Daniela Molina',
        materia: 'Programación II',
        horario: '09:00 - 11:00',
        observaciones: 'Se colaboró con la configuración del entorno de trabajo.',
      },
    ],
    actividadesLaboratorio: [
      'Preparación de equipos.',
      'Apoyo durante clases.',
      'Verificación de software.',
      'Cierre del laboratorio.',
    ],
    incidencias: [],
    pendientes: [
      'Verificar la actualización del software en tres equipos.',
    ],
    estadoRecomendacion:
      'Completar la actualización del software pendiente.',
    estado: 'GUARDADO',
  },
];

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="bg-white rounded-xl border overflow-hidden"
      style={{ borderColor: '#e2e8f0' }}
    >
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: '#e2e8f0' }}
      >
        <h2
          className="text-sm font-bold"
          style={{
            color: '#172033',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {titulo}
        </h2>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

export default function AdminVisualizarInformeScreen({
  informeId,
  onNavigate,
  onLogout,
}: Props) {
  const informe = informesDetalle.find(
    (item) => item.id === Number(informeId),
  );

  if (!informe) {
    return (
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: '#f6f8fc' }}
      >
        <AdminSidebar
          active="admin-informes"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white border rounded-xl p-8 text-center max-w-md">
            <h2
              className="font-bold text-lg"
              style={{ color: '#172033' }}
            >
              Informe no encontrado
            </h2>

            <p
              className="text-sm mt-2 mb-5"
              style={{ color: '#7a8496' }}
            >
              No se encontró información para el informe seleccionado.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('admin-informes')}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: B_MID }}
            >
              Volver a informes
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: '#f6f8fc' }}
    >
      <AdminSidebar
        active="admin-informes"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 min-w-0">
        {/* ENCABEZADO */}
        <header
          className="bg-white border-b px-8 py-5"
          style={{ borderColor: '#e5eaf2' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1
                className="text-xl font-bold"
                style={{
                  color: '#172033',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Visualizar informe
              </h1>

              <p
                className="text-sm mt-1"
                style={{ color: '#7a8496' }}
              >
                Consulta del informe diario registrado por el auxiliar.
              </p>
            </div>

            <div className="text-right">
              <div
                className="text-sm font-semibold"
                style={{ color: '#26354d' }}
              >
                Administrador
              </div>

              <div
                className="text-xs"
                style={{ color: '#8993a5' }}
              >
                Laboratorio de Cómputo
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* VOLVER */}
          <button
            type="button"
            onClick={() => onNavigate('admin-informes')}
            className="flex items-center gap-2 text-sm font-semibold mb-5"
            style={{ color: B_MID }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>

            Volver a informes
          </button>

          {/* INFORMACIÓN GENERAL */}
          <section
            className="bg-white rounded-xl border p-6 mb-5"
            style={{ borderColor: '#e2e8f0' }}
          >
            <div className="flex flex-wrap justify-between gap-6">
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: '#8fa0b8' }}
                >
                  Auxiliar
                </div>

                <div
                  className="text-lg font-bold"
                  style={{
                    color: '#172033',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {informe.auxiliar}
                </div>

                <div
                  className="text-sm mt-1"
                  style={{ color: '#5a6a82' }}
                >
                  {informe.cargo}
                </div>

                <div
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Código SISS: {informe.codigoSiss}
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Fecha
                  </div>

                  <div
                    className="text-sm font-semibold"
                    style={{ color: '#26354d' }}
                  >
                    {formatearFecha(informe.fecha)}
                  </div>
                </div>

                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Horario
                  </div>

                  <div
                    className="text-sm font-semibold"
                    style={{ color: '#26354d' }}
                  >
                    {informe.horarioInicio} - {informe.horarioFin}
                  </div>
                </div>

                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Estado
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                    }}
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: '#16a34a',
                      }}
                    />

                    Guardado
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-5">
            {/* ACTIVIDADES ACADÉMICAS */}
            <Seccion titulo="Actividades académicas">
              {informe.actividadesAcademicas.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: '#8993a5' }}
                >
                  No se registraron actividades académicas.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {informe.actividadesAcademicas.map(
                    (actividad, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-4"
                        style={{
                          borderColor: '#e5eaf2',
                          backgroundColor: '#fafbfd',
                        }}
                      >
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                          <div>
                            <div
                              className="text-xs"
                              style={{ color: '#8993a5' }}
                            >
                              Sala
                            </div>

                            <div
                              className="text-sm font-semibold"
                              style={{ color: '#26354d' }}
                            >
                              {actividad.sala}
                            </div>
                          </div>

                          <div>
                            <div
                              className="text-xs"
                              style={{ color: '#8993a5' }}
                            >
                              Docente
                            </div>

                            <div
                              className="text-sm font-semibold"
                              style={{ color: '#26354d' }}
                            >
                              {actividad.docente}
                            </div>
                          </div>

                          <div>
                            <div
                              className="text-xs"
                              style={{ color: '#8993a5' }}
                            >
                              Materia
                            </div>

                            <div
                              className="text-sm font-semibold"
                              style={{ color: '#26354d' }}
                            >
                              {actividad.materia}
                            </div>
                          </div>

                          <div>
                            <div
                              className="text-xs"
                              style={{ color: '#8993a5' }}
                            >
                              Horario
                            </div>

                            <div
                              className="text-sm font-semibold"
                              style={{ color: '#26354d' }}
                            >
                              {actividad.horario}
                            </div>
                          </div>
                        </div>

                        {actividad.observaciones && (
                          <div
                            className="mt-4 pt-3 border-t"
                            style={{ borderColor: '#e5eaf2' }}
                          >
                            <div
                              className="text-xs mb-1"
                              style={{ color: '#8993a5' }}
                            >
                              Observaciones
                            </div>

                            <p
                              className="text-sm"
                              style={{ color: '#536076' }}
                            >
                              {actividad.observaciones}
                            </p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </Seccion>

            {/* ACTIVIDADES DE LABORATORIO */}
            <Seccion titulo="Actividades de laboratorio">
              {informe.actividadesLaboratorio.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: '#8993a5' }}
                >
                  No se registraron actividades de laboratorio.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {informe.actividadesLaboratorio.map(
                    (actividad, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg px-4 py-3"
                        style={{ backgroundColor: '#fafbfd' }}
                      >
                        <span
                          className="flex items-center justify-center rounded-full text-xs font-bold shrink-0"
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: B_LIGHT,
                            color: B_DARK,
                          }}
                        >
                          {index + 1}
                        </span>

                        <span
                          className="text-sm pt-0.5"
                          style={{ color: '#536076' }}
                        >
                          {actividad}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </Seccion>

            {/* INCIDENCIAS */}
            <Seccion titulo="Incidencias">
              {informe.incidencias.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: '#8993a5' }}
                >
                  No se registraron incidencias durante el turno.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {informe.incidencias.map((incidencia, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4"
                      style={{ borderColor: '#e5eaf2' }}
                    >
                      <div className="mb-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-md"
                          style={{
                            backgroundColor: '#fff7ed',
                            color: '#9a3412',
                          }}
                        >
                          {incidencia.equipo}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div
                          className="text-xs mb-1"
                          style={{ color: '#8993a5' }}
                        >
                          Descripción
                        </div>

                        <p
                          className="text-sm"
                          style={{ color: '#536076' }}
                        >
                          {incidencia.descripcion}
                        </p>
                      </div>

                      <div>
                        <div
                          className="text-xs mb-1"
                          style={{ color: '#8993a5' }}
                        >
                          Acción realizada
                        </div>

                        <p
                          className="text-sm"
                          style={{ color: '#536076' }}
                        >
                          {incidencia.accion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Seccion>

            {/* PENDIENTES */}
            <Seccion titulo="Pendientes">
              {informe.pendientes.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: '#8993a5' }}
                >
                  No existen pendientes registrados.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {informe.pendientes.map((pendiente, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: '#536076' }}
                    >
                      <span
                        className="rounded-full shrink-0 mt-2"
                        style={{
                          width: 6,
                          height: 6,
                          backgroundColor: B_MID,
                        }}
                      />

                      {pendiente}
                    </li>
                  ))}
                </ul>
              )}
            </Seccion>

            {/* RECOMENDACIONES */}
            <Seccion titulo="Estado y recomendaciones">
              <div
                className="rounded-lg p-4 text-sm"
                style={{
                  backgroundColor: '#fafbfd',
                  color: '#536076',
                }}
              >
                {informe.estadoRecomendacion ||
                  'No se registraron recomendaciones.'}
              </div>
            </Seccion>
          </div>

          {/* BOTÓN FINAL */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => onNavigate('admin-informes')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{
                color: B_DARK,
                backgroundColor: 'white',
                border: '1.5px solid #cdd5e0',
              }}
            >
              Volver a informes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}