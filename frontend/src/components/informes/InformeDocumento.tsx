import type { AdminInformeDetalle } from '../../services/admin.service';

interface Props {
  informe: AdminInformeDetalle;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

function formatearFecha(fecha: string): string {
  if (!fecha) return '—';

  const parteFecha = fecha.substring(0, 10);
  const [anio, mes, dia] = parteFecha.split('-');

  if (!anio || !mes || !dia) return fecha;

  return `${dia}/${mes}/${anio}`;
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
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
        {children}
      </h3>
    </div>
  );
}

export default function InformeDocumento({ informe }: Props) {
  const horarioTurno =
    `${informe.horarioInicio} - ${informe.horarioFin}`;

  return (
    <article
      className="informe-documento bg-white"
      style={{
        color: '#111827',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* CABECERA */}
      <div
        className="px-10 py-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
          color: 'white',
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        <h1
          className="text-xl font-bold"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Informe Diario de Laboratorio
        </h1>

        <p
          className="text-sm mt-1"
          style={{ color: 'rgba(255,255,255,0.80)' }}
        >
          Laboratorios de Informática y Sistemas · UMSS
        </p>
      </div>

      <div className="px-10 py-8">
        {/* INFORMACIÓN GENERAL */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-4 pb-6 mb-7"
          style={{ borderBottom: '1px solid #e2e8f0' }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#8fa0b8' }}
            >
              Responsable
            </p>
            <p className="text-sm font-semibold mt-1">
              {informe.usuario.nombreCompleto}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>
              {informe.usuario.cargo}
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#8fa0b8' }}
            >
              Código SISS
            </p>
            <p className="text-sm font-semibold mt-1">
              {informe.usuario.codigoSiss || 'No registrado'}
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#8fa0b8' }}
            >
              Fecha
            </p>
            <p className="text-sm font-semibold mt-1">
              {formatearFecha(informe.fecha)}
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#8fa0b8' }}
            >
              Horario del turno
            </p>
            <p className="text-sm font-semibold mt-1">
              {horarioTurno}
            </p>

            {informe.horarioModificado && (
              <p
                className="text-xs mt-1"
                style={{ color: '#b45309' }}
              >
                Horario modificado
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-7">
          {/* 1. ACTIVIDADES ACADÉMICAS */}
          <section>
            <TituloSeccion>1. Actividades académicas</TituloSeccion>

            {informe.actividadesAcademicas.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#8fa0b8' }}>
                No se registraron actividades académicas.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {informe.actividadesAcademicas.map((actividad, index) => {
                  const docente =
                    actividad.docente?.nombreCompleto ||
                    actividad.docenteOtro ||
                    'No registrado';

                  const materia =
                    actividad.materia?.nombre ||
                    actividad.materiaOtra ||
                    'No registrada';

                  return (
                    <div
                      key={actividad.id}
                      className="rounded-xl p-4 actividad-bloque"
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-3"
                        style={{ color: '#8fa0b8' }}
                      >
                        Actividad #{index + 1}
                      </p>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <p className="text-xs" style={{ color: '#8fa0b8' }}>
                            Sala
                          </p>
                          <p className="text-sm font-medium">
                            {actividad.sala}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs" style={{ color: '#8fa0b8' }}>
                            Horario
                          </p>
                          <p className="text-sm font-medium">
                            {actividad.horarioInicio} - {actividad.horarioFin}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs" style={{ color: '#8fa0b8' }}>
                            Docente
                          </p>
                          <p className="text-sm font-medium">{docente}</p>
                        </div>

                        <div>
                          <p className="text-xs" style={{ color: '#8fa0b8' }}>
                            Materia
                          </p>
                          <p className="text-sm font-medium">{materia}</p>
                        </div>
                      </div>

                      {actividad.observaciones && (
                        <div
                          className="mt-3 pt-3"
                          style={{ borderTop: '1px solid #e2e8f0' }}
                        >
                          <p className="text-xs" style={{ color: '#8fa0b8' }}>
                            Observaciones
                          </p>
                          <p className="text-sm mt-1">
                            {actividad.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 2. ACTIVIDADES DE LABORATORIO */}
          <section>
            <TituloSeccion>2. Actividades de laboratorio</TituloSeccion>

            {informe.actividadesLaboratorio.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#8fa0b8' }}>
                No se registraron actividades de laboratorio.
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {informe.actividadesLaboratorio.map((actividad, index) => (
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
                      }}
                    >
                      {index + 1}
                    </span>

                    <span className="text-sm pt-0.5">
                      {actividad.descripcion}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* 3. INCIDENCIAS */}
          <section>
            <TituloSeccion>3. Incidencias</TituloSeccion>

            {informe.incidencias.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#8fa0b8' }}>
                No se registraron incidencias durante el turno.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {informe.incidencias.map((incidencia, index) => (
                  <div
                    key={incidencia.id}
                    className="rounded-xl p-4 incidencia-bloque"
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-3"
                      style={{ color: '#8fa0b8' }}
                    >
                      Incidencia #{index + 1}
                    </p>

                    <div className="grid gap-2.5">
                      <div>
                        <p className="text-xs" style={{ color: '#8fa0b8' }}>
                          Equipo / Sala / Situación
                        </p>
                        <p className="text-sm font-medium">
                          {incidencia.equipo}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs" style={{ color: '#8fa0b8' }}>
                          Descripción
                        </p>
                        <p className="text-sm">
                          {incidencia.descripcion}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs" style={{ color: '#8fa0b8' }}>
                          Acción realizada
                        </p>
                        <p className="text-sm">
                          {incidencia.accion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. PENDIENTES */}
          <section>
            <TituloSeccion>4. Pendientes</TituloSeccion>

            {informe.pendientes.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#8fa0b8' }}>
                No existen pendientes registrados.
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {informe.pendientes.map((pendiente, index) => (
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
                      }}
                    >
                      {index + 1}
                    </span>

                    <span className="text-sm pt-0.5">
                      {pendiente.descripcion}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* 5. ESTADO Y RECOMENDACIONES */}
          <section>
            <TituloSeccion>5. Estado y recomendaciones</TituloSeccion>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: B_LIGHT,
                border: '1px solid #d1ddf5',
              }}
            >
              <p className="text-sm">
                {informe.estadoRecomendacion ||
                  'No se registraron recomendaciones.'}
              </p>
            </div>
          </section>

          {/* PIE DEL INFORME */}
          <div
            className="pt-6 flex items-center justify-between"
            style={{ borderTop: '1px solid #e2e8f0' }}
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
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {informe.usuario.nombreCompleto}
              </p>

              <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>
                {informe.usuario.cargo}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs" style={{ color: '#8fa0b8' }}>
                Fecha del informe
              </p>

              <p className="text-sm font-medium">
                {formatearFecha(informe.fecha)}
              </p>

              <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>
                Turno: {horarioTurno}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
