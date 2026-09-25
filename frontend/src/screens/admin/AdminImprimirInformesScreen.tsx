import { useEffect, useState } from 'react';
import type { AdminScreen } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import InformeDocumento from '../../components/informes/InformeDocumento';
import {
  obtenerAdminInformes,
  obtenerAdminInformePorId,
  formatearFechaAdmin,
  type AdminInformeDetalle,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2855a5';

export default function AdminImprimirInformesScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [informes, setInformes] = useState<AdminInformeDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const fechaDesde =
    localStorage.getItem('adminPrintFechaDesde') || '';

  const fechaHasta =
    localStorage.getItem('adminPrintFechaHasta') || '';

  const auxiliarIdGuardado =
    localStorage.getItem('adminPrintAuxiliarId');

  useEffect(() => {
    let activo = true;

    const cargarInformes = async () => {
      try {
        setCargando(true);
        setError('');

        if (!fechaDesde || !fechaHasta) {
          throw new Error(
            'No se ha seleccionado un rango de fechas.'
          );
        }

        const resumenes = await obtenerAdminInformes({
          fechaDesde,
          fechaHasta,
          auxiliarId: auxiliarIdGuardado
            ? Number(auxiliarIdGuardado)
            : undefined,
        });

        const detalles = await Promise.all(
          resumenes.map((informe) =>
            obtenerAdminInformePorId(informe.id)
          )
        );

        // Ordenamos primero por fecha y luego por auxiliar.
        detalles.sort((a, b) => {
          const fechaA = a.fecha.substring(0, 10);
          const fechaB = b.fecha.substring(0, 10);

          if (fechaA !== fechaB) {
            return fechaA.localeCompare(fechaB);
          }

          return a.usuario.nombreCompleto.localeCompare(
            b.usuario.nombreCompleto
          );
        });

        if (activo) {
          setInformes(detalles);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar los informes.'
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarInformes();

    return () => {
      activo = false;
    };
  }, [fechaDesde, fechaHasta, auxiliarIdGuardado]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="flex"
      style={{ minHeight: '100vh' }}
    >
      <div className="no-print">
        <AdminSidebar
          active="admin-informes"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      <main
        className="flex-1"
        style={{ backgroundColor: '#f1f4f9' }}
      >
        {/* CABECERA */}
        <header
          className="no-print flex items-center justify-between px-8 py-4 border-b"
          style={{
            backgroundColor: 'white',
            borderColor: '#e2e8f0',
          }}
        >
          <div>
            <h1
              className="font-semibold text-base"
              style={{
                color: '#111827',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Vista previa de impresión
            </h1>

            <p
              className="text-xs mt-1"
              style={{ color: '#5a6a82' }}
            >
              {fechaDesde && fechaHasta
                ? `${formatearFechaAdmin(
                    fechaDesde
                  )} al ${formatearFechaAdmin(fechaHasta)}`
                : 'Sin rango seleccionado'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onNavigate('admin-informes')
              }
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                border: '1px solid #cdd5e0',
                color: '#5a6a82',
                backgroundColor: 'white',
              }}
            >
              Volver
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={
                cargando ||
                informes.length === 0 ||
                Boolean(error)
              }
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{
                background:
                  informes.length > 0
                    ? `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`
                    : '#94a3b8',
              }}
            >
              Imprimir / PDF
            </button>
          </div>
        </header>

        {/* CONTENIDO TEMPORAL */}
        <div className="px-8 py-8 max-w-5xl mx-auto">
          {cargando ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: B_DARK }}
              >
                Cargando informes...
              </p>

              <p
                className="text-xs mt-2"
                style={{ color: '#8fa0b8' }}
              >
                Obteniendo el detalle de los informes del período.
              </p>
            </div>
          ) : error ? (
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: '#991b1b' }}
              >
                {error}
              </p>
            </div>
          ) : informes.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: '#111827' }}
              >
                No existen informes en el rango seleccionado.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 print:gap-0">
                {informes.map((informe, index) => (
                    <div
                    key={informe.id}
                    className={
                        index < informes.length - 1
                        ? 'informe-impresion-multiple'
                        : ''
                    }
                    style={{
                        maxWidth: 800,
                        width: '100%',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: '0 2px 16px rgba(26,61,124,0.10)',
                        border: '1px solid #e2e8f0',
                    }}
                    >
                    <InformeDocumento informe={informe} />
                    </div>
                ))}
                </div>
          )}
        </div>
      </main>
    </div>
  );
}