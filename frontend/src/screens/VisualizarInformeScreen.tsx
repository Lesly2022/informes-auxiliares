import type { Informe, Screen } from '../types';
import { USUARIO, formatFecha } from '../data';
import Sidebar from '../components/Sidebar';

interface Props {
  informe: Informe;
  onNavigate: (s: Screen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

export default function VisualizarInformeScreen({ informe, onNavigate, onLogout }: Props) {
  const handlePrint = () => window.print();

  const sectionHeading = (title: string) => (
    <div className="mb-3">
      <h3
        className="font-bold text-sm uppercase tracking-widest pb-2"
        style={{ color: B_DARK, borderBottom: `2px solid ${B_DARK}`, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em' }}
      >
        {title}
      </h3>
    </div>
  );

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <div className="no-print">
        <Sidebar active="informes" onNavigate={onNavigate} onLogout={onLogout} />
      </div>

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f1f4f9' }}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b no-print" style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('informes')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ color: '#5a6a82', border: '1.5px solid #cdd5e0', backgroundColor: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver
            </button>
            <div>
              <h1 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
                Informe del {formatFecha(informe.fecha)}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>Turno: {informe.horario}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: '1.5px solid #cdd5e0', color: '#5a6a82', backgroundColor: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
              Imprimir / PDF
            </button>
            <button
              onClick={() => onNavigate('editar', informe.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(37,84,168,0.28)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar informe
            </button>
          </div>
        </header>

        {/* Document */}
        <div className="flex-1 px-8 py-8 flex justify-center">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ maxWidth: 800, backgroundColor: 'white', boxShadow: '0 2px 16px rgba(26,61,124,0.10)', border: '1px solid #e2e8f0' }}
          >
            {/* Document header */}
            <div
              className="px-10 py-8 text-center"
              style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)` }}
            >
              {/* UMSS emblem placeholder */}
              <div
                className="rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em', fontSize: 10 }}>
                Informe Diario de Laboratorio
              </p>
              <h1 className="text-xl font-bold text-white leading-tight mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                UNIVERSIDAD MAYOR DE SAN SIMÓN
              </h1>
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                LABORATORIO DE CÓMPUTO – INFORMÁTICA Y SISTEMAS
              </p>
              <div
                className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#86efac', display: 'inline-block' }} />
                {informe.estado}
              </div>
            </div>

            {/* Document body */}
            <div className="px-10 py-8 flex flex-col gap-8">

              {/* 1. Datos generales */}
              <section>
                {sectionHeading('1. Datos Generales')}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Nombre completo', value: USUARIO.nombre },
                    { label: 'Fecha', value: formatFecha(informe.fecha) },
                    { label: 'Horario del turno', value: informe.horario },
                    { label: 'Cargo', value: USUARIO.cargo },
                    { label: 'Código SISS', value: USUARIO.codigoSiss },
                    { label: 'N° de Carnet', value: USUARIO.carnet },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: '#8fa0b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Actividades académicas */}
              <section>
                {sectionHeading('2. Actividades Académicas Realizadas')}
                {informe.actividadesAcademicas.length === 0 ? (
                  <p className="text-sm italic" style={{ color: '#8fa0b8' }}>No se registraron actividades académicas durante el turno.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: '#fafbfd', borderBottom: '1px solid #e2e8f0' }}>
                          {['Sala', 'Docente / Responsable', 'Materia / Actividad', 'Horario', 'Observaciones'].map(col => (
                            <th key={col} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8fa0b8', fontSize: 10 }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {informe.actividadesAcademicas.map((act, i) => (
                          <tr key={act.id} style={{ borderBottom: i < informe.actividadesAcademicas.length - 1 ? '1px solid #f0f4fb' : 'none' }}>
                            <td className="px-4 py-3 text-sm" style={{ color: '#111827' }}>{act.sala || '—'}</td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#111827' }}>
                              {act.docente === 'Otro' ? act.docenteOtro || '—' : act.docente || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#111827' }}>
                              {act.materia === 'Otra' ? act.materiaOtra || '—' : act.materia || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#111827' }}>{act.horario || '—'}</td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#5a6a82' }}>{act.observaciones || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* 3. Actividades laboratorio */}
              <section>
                {sectionHeading('3. Actividades Realizadas en el Laboratorio')}
                <ol className="flex flex-col gap-2">
                  {informe.actividadesLaboratorio.map((act, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ width: 24, height: 24, backgroundColor: B_LIGHT, color: B_DARK, marginTop: 1 }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm" style={{ color: '#111827', lineHeight: 1.65 }}>{act}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* 4. Incidencias */}
              <section>
                {sectionHeading('4. Incidencias y Observaciones')}
                {informe.incidencias.length === 0 ? (
                  <p className="text-sm italic" style={{ color: '#8fa0b8' }}>No se registraron incidencias durante el turno.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {informe.incidencias.map((inc, i) => (
                      <div key={inc.id} className="rounded-xl p-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#8fa0b8' }}>Incidencia #{i + 1}</p>
                        <div className="grid gap-2.5">
                          <div>
                            <p className="text-xs font-medium mb-0.5" style={{ color: '#8fa0b8' }}>Equipo / Sala / Situación</p>
                            <p className="text-sm font-medium" style={{ color: '#111827' }}>{inc.equipo}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-0.5" style={{ color: '#8fa0b8' }}>Descripción</p>
                            <p className="text-sm" style={{ color: '#111827', lineHeight: 1.6 }}>{inc.descripcion}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-0.5" style={{ color: '#8fa0b8' }}>Acción realizada</p>
                            <p className="text-sm" style={{ color: '#111827', lineHeight: 1.6 }}>{inc.accion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 5. Pendientes */}
              <section>
                {sectionHeading('5. Pendientes')}
                {informe.pendientes.length === 0 && !informe.estadoRecomendacion ? (
                  <p className="text-sm italic" style={{ color: '#8fa0b8' }}>No se registraron pendientes.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {informe.pendientes.length > 0 && (
                      <ol className="flex flex-col gap-2">
                        {informe.pendientes.map((p, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span
                              className="flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ width: 24, height: 24, backgroundColor: '#f1f4f9', color: '#5a6a82', marginTop: 1 }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-sm" style={{ color: '#111827', lineHeight: 1.65 }}>{p}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {informe.estadoRecomendacion && (
                      <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: B_LIGHT, border: `1px solid #d1ddf5` }}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: B_DARK }}>
                          Estado / Recomendación para el siguiente turno
                        </p>
                        <p className="text-sm" style={{ color: '#111827', lineHeight: 1.6 }}>{informe.estadoRecomendacion}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Footer */}
              <div className="pt-6 flex items-center justify-between" style={{ borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <p style={{ color: '#8fa0b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>
                    Responsable del informe
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{USUARIO.nombre}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>{USUARIO.cargo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#8fa0b8' }}>Fecha del informe</p>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{formatFecha(informe.fecha)}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>Turno: {informe.horario}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
