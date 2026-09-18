import { useEffect, useState } from 'react';
import type { Screen } from '../types';
import Sidebar from '../components/Sidebar';
import {
  obtenerInformePorId,
  type InformeDetalle,
} from '../services/informes.service';

interface Props {
  informeId: string;
  onNavigate: (s: Screen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

function formatFecha(fecha: string): string {
  if (!fecha) return '—';

  const partes = fecha.split('-');

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
}

export default function VisualizarInformeScreen({
  informeId,
  onNavigate,
  onLogout,
}: Props) {
  const [informe, setInforme] = useState<InformeDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarInforme = async () => {
      try {
        setCargando(true);
        setError('');

        const data = await obtenerInformePorId(informeId);

        if (activo) {
          setInforme(data);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar el informe'
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarInforme();

    return () => {
      activo = false;
    };
  }, [informeId]);

  const handlePrint = () => window.print();

  const sectionHeading = (title: string) => (
    <div className="mb-3">
      <h3
        className="font-bold text-sm uppercase tracking-widest pb-2"
        style={{
          color: B_DARK,
          borderBottom: `2px solid ${B_DARK}`,
          fontFamily: 'DM Sans, sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </h3>
    </div>
  );

  if (cargando) {
    return (
      <div className="flex" style={{ minHeight: '100vh' }}>
        <Sidebar
          active="informes"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />

        <main
          className="flex-1 flex items-center justify-center"
          style={{ backgroundColor: '#f1f4f9' }}
        >
          <div className="text-center">
            <p
              className="text-base font-semibold"
              style={{ color: B_DARK }}
            >
              Cargando informe...
            </p>

            <p
              className="text-sm mt-2"
              style={{ color: '#5a6a82' }}
            >
              Obteniendo la información registrada.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !informe) {
    return (
      <div className="flex" style={{ minHeight: '100vh' }}>
        <Sidebar
          active="informes"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />

        <main
          className="flex-1 flex items-center justify-center"
          style={{ backgroundColor: '#f1f4f9' }}
        >
          <div
            className="rounded-xl p-6 text-center"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              maxWidth: 450,
            }}
          >
            <p
              className="font-semibold mb-2"
              style={{ color: '#b91c1c' }}
            >
              No se pudo cargar el informe
            </p>

            <p
              className="text-sm mb-5"
              style={{ color: '#5a6a82' }}
            >
              {error || 'El informe solicitado no existe.'}
            </p>

            <button
              onClick={() => onNavigate('informes')}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: B_DARK }}
            >
              Volver a informes
            </button>
          </div>
        </main>
      </div>
    );
  }

  const horarioTurno =
    `${informe.horarioInicio} - ${informe.horarioFin}`;

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <div className="no-print">
        <Sidebar
          active="informes"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      <main
        className="flex-1 flex flex-col"
        style={{ backgroundColor: '#f1f4f9' }}
      >
        <header
          className="flex items-center justify-between px-8 py-4 border-b no-print"
          style={{
            backgroundColor: 'white',
            borderColor: '#e2e8f0',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('informes')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                color: '#5a6a82',
                border: '1.5px solid #cdd5e0',
                backgroundColor: 'transparent',
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>

              Volver
            </button>

            <div>
              <h1
                className="font-semibold text-base"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#111827',
                }}
              >
                Informe del {formatFecha(informe.fecha)}
              </h1>

              <p
                className="text-xs mt-0.5"
                style={{ color: '#5a6a82' }}
              >
                Turno: {horarioTurno}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                border: '1.5px solid #cdd5e0',
                color: '#5a6a82',
                backgroundColor: 'transparent',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>

              Imprimir / PDF
            </button>

            <button
              onClick={() =>
                onNavigate('editar', String(informe.id))
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>

              Editar informe
            </button>
          </div>
        </header>

        <div className="flex-1 px-8 py-8 flex justify-center">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: 800,
              backgroundColor: 'white',
              boxShadow: '0 2px 16px rgba(26,61,124,0.10)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              className="px-10 py-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.25)',
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>

              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.18em',
                  fontSize: 10,
                }}
              >
                Informe Diario de Laboratorio
              </p>

              <h1
                className="text-xl font-bold text-white leading-tight mb-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                UNIVERSIDAD MAYOR DE SAN SIMÓN
              </h1>

              <p
                className="text-sm font-semibold"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                LABORATORIO DE CÓMPUTO – INFORMÁTICA Y SISTEMAS
              </p>

              <div
                className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: '#86efac',
                    display: 'inline-block',
                  }}
                />

                {informe.estado}
              </div>
            </div>

            <div className="px-10 py-8 flex flex-col gap-8">
              <section>
                {sectionHeading('1. Datos Generales')}

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: 'Nombre completo',
                      value: informe.usuario.nombreCompleto,
                    },
                    {
                      label: 'Fecha',
                      value: formatFecha(informe.fecha),
                    },
                    {
                      label: 'Horario del turno',
                      value: horarioTurno,
                    },
                    {
                      label: 'Cargo',
                      value: informe.usuario.cargo,
                    },
                    {
                      label: 'Código SISS',
                      value: informe.usuario.codigoSiss,
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p
                        style={{
                          color: '#8fa0b8',
                          fontSize: 10,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        {label}
                      </p>

                      <p
                        className="text-sm font-medium"
                        style={{ color: '#111827' }}
                      >
                        {value || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                {sectionHeading(
                  '2. Actividades Académicas Realizadas'
                )}

                {informe.actividadesAcademicas.length === 0 ? (
                  <p
                    className="text-sm italic"
                    style={{ color: '#8fa0b8' }}
                  >
                    No se registraron actividades académicas durante el turno.
                  </p>
                ) : (
                  <div
                    className="overflow-x-auto rounded-xl"
                    style={{ border: '1px solid #e2e8f0' }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: '#fafbfd',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          {[
                            'Sala',
                            'Docente / Responsable',
                            'Materia / Actividad',
                            'Horario',
                            'Observaciones',
                          ].map((col) => (
                            <th
                              key={col}
                              className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                              style={{
                                color: '#8fa0b8',
                                fontSize: 10,
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {informe.actividadesAcademicas.map(
                          (act, i) => {
                            const docente =
                              act.docente?.nombreCompleto ||
                              act.docente?.nombre ||
                              act.docenteOtro ||
                              '—';

                            const materia =
                              act.materia?.nombre ||
                              act.materiaOtra ||
                              '—';

                            const horario =
                              act.horarioInicio &&
                              act.horarioFin
                                ? `${act.horarioInicio} - ${act.horarioFin}`
                                : '—';

                            return (
                              <tr
                                key={act.id}
                                style={{
                                  borderBottom:
                                    i <
                                    informe
                                      .actividadesAcademicas
                                      .length -
                                      1
                                      ? '1px solid #f0f4fb'
                                      : 'none',
                                }}
                              >
                                <td className="px-4 py-3">
                                  {act.sala || '—'}
                                </td>

                                <td className="px-4 py-3">
                                  {docente}
                                </td>

                                <td className="px-4 py-3">
                                  {materia}
                                </td>

                                <td className="px-4 py-3">
                                  {horario}
                                </td>

                                <td
                                  className="px-4 py-3"
                                  style={{ color: '#5a6a82' }}
                                >
                                  {act.observaciones || '—'}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section>
                {sectionHeading(
                  '3. Actividades Realizadas en el Laboratorio'
                )}

                {informe.actividadesLaboratorio.length === 0 ? (
                  <p
                    className="text-sm italic"
                    style={{ color: '#8fa0b8' }}
                  >
                    No se registraron actividades de laboratorio.
                  </p>
                ) : (
                  <ol className="flex flex-col gap-2">
                    {informe.actividadesLaboratorio.map(
                      (actividad, i) => (
                        <li
                          key={actividad.id}
                          className="flex items-start gap-3"
                        >
                          <span
                            className="shrink-0 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: B_LIGHT,
                              color: B_DARK,
                              marginTop: 1,
                            }}
                          >
                            {i + 1}
                          </span>

                          <span
                            className="text-sm"
                            style={{
                              color: '#111827',
                              lineHeight: 1.65,
                            }}
                          >
                            {actividad.descripcion}
                          </span>
                        </li>
                      )
                    )}
                  </ol>
                )}
              </section>

              <section>
                {sectionHeading(
                  '4. Incidencias y Observaciones'
                )}

                {informe.incidencias.length === 0 ? (
                  <p
                    className="text-sm italic"
                    style={{ color: '#8fa0b8' }}
                  >
                    No se registraron incidencias durante el turno.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {informe.incidencias.map((inc, i) => (
                      <div
                        key={inc.id}
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-3"
                          style={{ color: '#8fa0b8' }}
                        >
                          Incidencia #{i + 1}
                        </p>

                        <div className="grid gap-2.5">
                          <div>
                            <p
                              className="text-xs font-medium mb-0.5"
                              style={{ color: '#8fa0b8' }}
                            >
                              Equipo / Sala / Situación
                            </p>

                            <p className="text-sm font-medium">
                              {inc.equipo}
                            </p>
                          </div>

                          <div>
                            <p
                              className="text-xs font-medium mb-0.5"
                              style={{ color: '#8fa0b8' }}
                            >
                              Descripción
                            </p>

                            <p className="text-sm">
                              {inc.descripcion}
                            </p>
                          </div>

                          <div>
                            <p
                              className="text-xs font-medium mb-0.5"
                              style={{ color: '#8fa0b8' }}
                            >
                              Acción realizada
                            </p>

                            <p className="text-sm">
                              {inc.accion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                {sectionHeading('5. Pendientes')}

                {informe.pendientes.length === 0 &&
                !informe.estadoRecomendacion ? (
                  <p
                    className="text-sm italic"
                    style={{ color: '#8fa0b8' }}
                  >
                    No se registraron pendientes.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {informe.pendientes.length > 0 && (
                      <ol className="flex flex-col gap-2">
                        {informe.pendientes.map(
                          (pendiente, i) => (
                            <li
                              key={pendiente.id}
                              className="flex items-start gap-3"
                            >
                              <span
                                className="shrink-0 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{
                                  width: 24,
                                  height: 24,
                                  backgroundColor: '#f1f4f9',
                                  color: '#5a6a82',
                                  marginTop: 1,
                                }}
                              >
                                {i + 1}
                              </span>

                              <span className="text-sm">
                                {pendiente.descripcion}
                              </span>
                            </li>
                          )
                        )}
                      </ol>
                    )}

                    {informe.estadoRecomendacion && (
                      <div
                        className="rounded-xl p-4 mt-2"
                        style={{
                          backgroundColor: B_LIGHT,
                          border: '1px solid #d1ddf5',
                        }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-1.5"
                          style={{ color: B_DARK }}
                        >
                          Estado / Recomendación para el siguiente turno
                        </p>

                        <p className="text-sm">
                          {informe.estadoRecomendacion}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <div
                className="pt-6 flex items-center justify-between"
                style={{
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <p
                    style={{
                      color: '#8fa0b8',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    Responsable del informe
                  </p>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: '#111827',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {informe.usuario.nombreCompleto}
                  </p>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: '#5a6a82' }}
                  >
                    {informe.usuario.cargo}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="text-xs"
                    style={{ color: '#8fa0b8' }}
                  >
                    Fecha del informe
                  </p>

                  <p
                    className="text-sm font-medium"
                    style={{ color: '#111827' }}
                  >
                    {formatFecha(informe.fecha)}
                  </p>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: '#5a6a82' }}
                  >
                    Turno: {horarioTurno}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}