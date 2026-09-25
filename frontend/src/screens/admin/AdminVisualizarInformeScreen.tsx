import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminInformePorId,
  formatearFechaAdmin,
  type AdminInformeDetalle,
} from '../../services/admin.service';

interface Props {
  informeId: string;
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#eef4ff';

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
  const [informe, setInforme] = useState<AdminInformeDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarInforme = async () => {
      try {
        setCargando(true);
        setError('');

        const data = await obtenerAdminInformePorId(informeId);

        setInforme(data);
      } catch (err) {
        console.error('Error al cargar el informe:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el informe seleccionado'
        );

        setInforme(null);
      } finally {
        setCargando(false);
      }
    };

    cargarInforme();
  }, [informeId]);

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
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
          <div className="text-center">
            <div
              className="rounded-full mx-auto mb-4"
              style={{
                width: 34,
                height: 34,
                border: '3px solid #e2e8f0',
                borderTopColor: B_DARK,
                animation: 'spin 0.8s linear infinite',
              }}
            />

            <p
              className="text-sm font-medium"
              style={{ color: '#5a6a82' }}
            >
              Cargando informe...
            </p>

            <style>
              {`
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // ERROR / INFORME NO ENCONTRADO
  // ==========================================

  if (error || !informe) {
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
            <div
              className="rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{
                width: 52,
                height: 52,
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              !
            </div>

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
              {error ||
                'No se encontró información para el informe seleccionado.'}
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

  // ==========================================
  // INFORME
  // ==========================================

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
                Laboratorio de Informática y Sistemas
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
                  {informe.usuario.nombreCompleto}
                </div>

                <div
                  className="text-sm mt-1"
                  style={{ color: '#5a6a82' }}
                >
                  {informe.usuario.cargo}
                </div>

                <div
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Código SISS: {informe.usuario.codigoSiss || 'No registrado'}
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
                    {formatearFechaAdmin(informe.fecha)}
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

                  {informe.horarioModificado && (
                    <div
                      className="text-xs mt-1"
                      style={{ color: '#b45309' }}
                    >
                      Horario modificado
                    </div>
                  )}
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

                    {informe.estado === 'GUARDADO'
                      ? 'Guardado'
                      : informe.estado}
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
                  {informe.actividadesAcademicas.map((actividad) => {
                    const nombreDocente =
                      actividad.docente?.nombreCompleto ||
                      actividad.docenteOtro ||
                      'No registrado';

                    const nombreMateria =
                      actividad.materia?.nombre ||
                      actividad.materiaOtra ||
                      'No registrada';

                    return (
                      <div
                        key={actividad.id}
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
                              {nombreDocente}
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
                              {nombreMateria}
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
                              {actividad.horarioInicio} -{' '}
                              {actividad.horarioFin}
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
                    );
                  })}
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
                        key={actividad.id}
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
                          {actividad.descripcion}
                        </span>
                      </div>
                    )
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
                  {informe.incidencias.map((incidencia) => (
                    <div
                      key={incidencia.id}
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
                  {informe.pendientes.map((pendiente) => (
                    <li
                      key={pendiente.id}
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

                      {pendiente.descripcion}
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

        <Footer />
      </main>
    </div>
  );
}