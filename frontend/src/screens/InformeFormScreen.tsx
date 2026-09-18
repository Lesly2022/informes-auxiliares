import { useState, useEffect } from 'react';
import type { ActividadAcademica, Incidencia, Screen } from '../types';
import { USUARIO, SALAS, DOCENTES, MATERIAS, HORARIOS_ACADEMICOS, HORARIOS_TURNO_ALTERNATIVOS, HORARIO_TURNO_DEFAULT } from '../data';
import Sidebar from '../components/Sidebar';
import {
  crearInforme,
  actualizarInforme,
  obtenerInformePorId,
  type CrearInformePayload,
} from '../services/informes.service';

interface Props {
  onNavigate: (s: Screen, id?: string) => void;
  onLogout: () => void;
  editReportId?: string | null;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';
const B_LIGHTER = '#f0f4fb';

function newId() { return Math.random().toString(36).slice(2); }
function newActividad(): ActividadAcademica {
  return { id: newId(), sala: '', docente: '', docenteOtro: '', materia: '', materiaOtra: '', horario: '', observaciones: '' };
}
function newIncidencia(): Incidencia {
  return { id: newId(), equipo: '', descripcion: '', accion: '' };
}

function ConfirmModal({ onCancel, onConfirm, isEdit }: { onCancel: () => void; onConfirm: () => void; isEdit: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="rounded-2xl p-7 w-full" style={{ maxWidth: 420, backgroundColor: 'white', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
        <div className="rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ width: 48, height: 48, backgroundColor: B_LIGHT }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
        </div>
        <h3 className="text-center font-bold text-lg mb-2" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
          {isEdit ? '¿Guardar cambios?' : '¿Guardar informe?'}
        </h3>
        <p className="text-center text-sm mb-6" style={{ color: '#5a6a82' }}>
          {isEdit
            ? 'Los cambios reemplazarán la versión anterior del informe.'
            : 'Una vez guardado, podrás visualizarlo o editarlo desde Informes Pasados.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg py-2.5 text-sm font-medium"
            style={{ border: '1.5px solid #cdd5e0', color: '#5a6a82', backgroundColor: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {isEdit ? 'Guardar cambios' : 'Guardar informe'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputBase: React.CSSProperties = {
  border: '1.5px solid #cdd5e0',
  backgroundColor: '#f8fafc',
  color: '#111827',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.15s',
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6a82' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 32,
};

function inputStyle(hasError?: boolean): React.CSSProperties {
  return { ...inputBase, borderColor: hasError ? '#c0392b' : '#cdd5e0', backgroundColor: hasError ? '#fdf0ee' : '#f8fafc' };
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: '24px 28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  marginBottom: 20,
};

function SectionHeader({ num, title, badge, badgeType }: { num: string; title: string; badge?: string; badgeType?: 'required' | 'optional' }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className="rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
        style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif' }}
      >
        {num}
      </div>
      <h2 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>{title}</h2>
      {badge && (
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: badgeType === 'required' ? '#fdf0ee' : '#f1f4f9',
            color: badgeType === 'required' ? '#c0392b' : '#5a6a82',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

export default function InformeFormScreen({ onNavigate, onLogout, editReportId }: Props) {
  const isEdit = !!editReportId;

  const obtenerFechaBolivia = () => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = partes.find((p) => p.type === 'year')?.value;
  const month = partes.find((p) => p.type === 'month')?.value;
  const day = partes.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
};

const [fecha, setFecha] = useState(obtenerFechaBolivia);
  const [horarioCambiado, setHorarioCambiado] = useState(false);
  const [horarioOtro, setHorarioOtro] = useState('');
  const [actividadesAcademicas, setActividadesAcademicas] = useState<ActividadAcademica[]>([]);
  const [actividadesLab, setActividadesLab] = useState<string[]>(['', '', '', '']);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [pendientes, setPendientes] = useState<string[]>(['', '', '']);
  const [estadoRecomendacion, setEstadoRecomendacion] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(USUARIO.nombre);
  const [cargandoEdicion, setCargandoEdicion] = useState(false);

  const horarioEfectivo = horarioCambiado ? horarioOtro : HORARIO_TURNO_DEFAULT;

useEffect(() => {
  if (!editReportId) {
    return;
  }

  let activo = true;

  const cargarInforme = async () => {
    try {
      setCargandoEdicion(true);
      setErrorGuardado('');

      const informe = await obtenerInformePorId(editReportId);

      if (!activo) return;

      // Datos generales
      setNombreUsuario(informe.usuario.nombreCompleto);
      setFecha(informe.fecha);

      const horarioInforme =
        `${informe.horarioInicio} - ${informe.horarioFin}`;

      if (
        informe.horarioModificado ||
        horarioInforme !== HORARIO_TURNO_DEFAULT
      ) {
        setHorarioCambiado(true);
        setHorarioOtro(horarioInforme);
      } else {
        setHorarioCambiado(false);
        setHorarioOtro('');
      }

      setActividadesAcademicas(
        informe.actividadesAcademicas.map((act) => {
          const nombreDocente =
            act.docente?.nombreCompleto ||
            act.docente?.nombre ||
            act.docenteOtro ||
            '';

          const nombreMateria =
            act.materia?.nombre ||
            act.materiaOtra ||
            '';

          const docenteEstaEnLista =
            DOCENTES.includes(nombreDocente);

          const materiaEstaEnLista =
            MATERIAS.includes(nombreMateria);

          return {
            id: String(act.id),
            sala: act.sala || '',

            docente: docenteEstaEnLista
              ? nombreDocente
              : nombreDocente
                ? 'Otro'
                : '',

            docenteOtro: docenteEstaEnLista
              ? ''
              : nombreDocente,

            materia: materiaEstaEnLista
              ? nombreMateria
              : nombreMateria
                ? 'Otra'
                : '',

            materiaOtra: materiaEstaEnLista
              ? ''
              : nombreMateria,

            horario:
              act.horarioInicio && act.horarioFin
                ? `${act.horarioInicio} - ${act.horarioFin}`
                : '',

            observaciones: act.observaciones || '',
          };
        })
      );

      const actividadesLaboratorio =
        informe.actividadesLaboratorio.map(
          (actividad) => actividad.descripcion
        );

      setActividadesLab(
        actividadesLaboratorio.length >= 4
          ? actividadesLaboratorio
          : [
              ...actividadesLaboratorio,
              ...Array(
                4 - actividadesLaboratorio.length
              ).fill(''),
            ]
      );

      setIncidencias(
        informe.incidencias.map((incidencia) => ({
          id: String(incidencia.id),
          equipo: incidencia.equipo,
          descripcion: incidencia.descripcion,
          accion: incidencia.accion,
        }))
      );

      const pendientesInforme =
        informe.pendientes.map(
          (pendiente) => pendiente.descripcion
        );

      setPendientes(
        pendientesInforme.length >= 3
          ? pendientesInforme
          : [
              ...pendientesInforme,
              ...Array(
                3 - pendientesInforme.length
              ).fill(''),
            ]
      );

      setEstadoRecomendacion(
        informe.estadoRecomendacion || ''
      );
    } catch (error) {
      if (!activo) return;

      if (error instanceof Error) {
        setErrorGuardado(error.message);
      } else {
        setErrorGuardado(
          'No se pudo cargar el informe para editar.'
        );
      }
    } finally {
      if (activo) {
        setCargandoEdicion(false);
      }
    }
  };

  cargarInforme();

  return () => {
    activo = false;
  };
}, [editReportId]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fecha) e.fecha = 'La fecha es obligatoria.';
    if (horarioCambiado && !horarioOtro.trim()) e.horario = 'Indica el nuevo horario del turno.';
    if (!actividadesLab.some(a => a.trim())) e.actividadesLab = 'Debes registrar al menos una actividad realizada en el laboratorio.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (!validate()) {
      document.getElementById('error-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setGuardando(true);
      setErrorGuardado('');

      const [horarioInicio, horarioFin] = horarioEfectivo
        .split('-')
        .map(h => h.trim());

      if (!horarioInicio || !horarioFin) {
        throw new Error('El horario debe tener el formato HH:MM - HH:MM');
      }

      const payload: CrearInformePayload = {
        horarioInicio,
        horarioFin,
        horarioModificado: horarioCambiado,
        actividadesAcademicas: actividadesAcademicas.map(act => ({
          sala: act.sala,
          docenteId: null,
          docenteOtro: act.docente === 'Otro' ? act.docenteOtro.trim() : act.docente.trim(),
          materiaId: null,
          materiaOtra: act.materia === 'Otra' ? act.materiaOtra.trim() : act.materia.trim(),
          horarioInicio: act.horario.split('-')[0]?.trim() || '',
          horarioFin: act.horario.split('-')[1]?.trim() || '',
          observaciones: act.observaciones.trim() || null,
        })),
        actividadesLaboratorio: actividadesLab.map(a => a.trim()).filter(Boolean),
        incidencias: incidencias
          .filter(i => i.equipo.trim() || i.descripcion.trim() || i.accion.trim())
          .map(i => ({
            equipo: i.equipo.trim(),
            descripcion: i.descripcion.trim(),
            accion: i.accion.trim(),
          })),
        pendientes: pendientes.map(p => p.trim()).filter(Boolean),
        estadoRecomendacion: estadoRecomendacion.trim() || null,
      };

      if (isEdit && editReportId) {
        await actualizarInforme(editReportId, payload);
      } else {
        await crearInforme(payload);
      }

      setShowConfirm(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onNavigate('informes');
      }, 1800);
    } catch (error) {
      setShowConfirm(false);
      if (error instanceof Error) {
        setErrorGuardado(error.message);
      } else {
        setErrorGuardado('Ocurrió un error al guardar el informe.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const addActividad = () => setActividadesAcademicas(prev => [...prev, newActividad()]);
  const removeActividad = (id: string) => setActividadesAcademicas(prev => prev.filter(a => a.id !== id));
  const updateActividad = (id: string, field: keyof ActividadAcademica, value: string) =>
    setActividadesAcademicas(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));

  const addActividadLab = () => setActividadesLab(prev => [...prev, '']);
  const removeActividadLab = (i: number) => setActividadesLab(prev => prev.filter((_, idx) => idx !== i));
  const updateActividadLab = (i: number, v: string) => setActividadesLab(prev => prev.map((a, idx) => idx === i ? v : a));

  const addIncidencia = () => setIncidencias(prev => [...prev, newIncidencia()]);
  const removeIncidencia = (id: string) => setIncidencias(prev => prev.filter(i => i.id !== id));
  const updateIncidencia = (id: string, field: keyof Incidencia, value: string) =>
    setIncidencias(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const addPendiente = () => setPendientes(prev => [...prev, '']);
  const removePendiente = (i: number) => setPendientes(prev => prev.filter((_, idx) => idx !== i));
  const updatePendiente = (i: number, v: string) => setPendientes(prev => prev.map((a, idx) => idx === i ? v : a));

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = B_MID;
    e.currentTarget.style.backgroundColor = 'white';
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? '#c0392b' : '#cdd5e0';
    e.currentTarget.style.backgroundColor = hasError ? '#fdf0ee' : '#f8fafc';
  };

  const addBtn = (onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
      style={{ color: B_MID, backgroundColor: B_LIGHT }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d1ddf5'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = B_LIGHT; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {label}
    </button>
  );

  const removeBtn = (onClick: () => void) => (
    <button
      onClick={onClick}
      className="rounded-lg px-2.5 py-1 text-xs flex items-center gap-1"
      style={{ color: '#c0392b', backgroundColor: '#fdf0ee' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fde0dc'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fdf0ee'; }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Eliminar
    </button>
  );

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar active={isEdit ? 'informes' : 'elaborar'} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f1f4f9' }}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b no-print" style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(isEdit ? 'informes' : 'dashboard')}
              className="rounded-lg p-1.5"
              style={{ color: '#5a6a82' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <h1 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
                {isEdit ? 'Editar informe' : 'Elaborar informe diario'}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>
                {isEdit ? 'Modifica los datos del informe seleccionado.' : 'Registra las actividades realizadas durante tu turno.'}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {['Datos generales', 'Actividades', 'Incidencias', 'Guardar'].map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: i === 3 ? B_LIGHT : '#f1f4f9', color: i === 3 ? B_MID : '#5a6a82' }}
                >
                  {i + 1}. {label}
                </div>
                {i < 3 && <span style={{ color: '#cdd5e0', fontSize: 12 }}>›</span>}
              </div>
            ))}
          </div>
        </header>

        {/* Toast */}
        {saved && (
          <div
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, color: 'white' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {isEdit ? 'Informe actualizado correctamente' : 'Informe guardado correctamente'}
            </span>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 px-6 py-6 max-w-4xl w-full mx-auto" style={{ paddingBottom: 100 }}>
          {/* Error summary */}
          {errorGuardado && (
            <div
              className="rounded-xl px-5 py-4 mb-5 flex items-start gap-3"
              style={{ backgroundColor: '#fdf0ee', border: '1px solid #f5c6bc' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm font-medium" style={{ color: '#c0392b' }}>{errorGuardado}</p>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div
              id="error-anchor"
              className="rounded-xl px-5 py-4 mb-5 flex items-start gap-3"
              style={{ backgroundColor: '#fdf0ee', border: '1px solid #f5c6bc' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#c0392b' }}>Completa los campos obligatorios:</p>
                <ul className="text-sm" style={{ color: '#c0392b' }}>
                  {Object.values(errors).map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* ── SECCIÓN 1: DATOS GENERALES ── */}
          <div style={cardStyle}>
            <SectionHeader num="1" title="Datos Generales" />
            <p className="text-sm mb-4" style={{ color: '#5a6a82' }}>Información básica del auxiliar y del turno.</p>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              {/* Nombre bloqueado */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8fa0b8', fontSize: 11 }}>Nombre completo</label>
                <input
                  type="text"
                  value={nombreUsuario}
                  readOnly
                  style={{ ...inputBase, backgroundColor: '#f1f4f9', color: '#5a6a82', cursor: 'not-allowed', borderColor: '#e2e8f0' }}
                />
              </div>

              {/* Fecha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8fa0b8', fontSize: 11 }}>
                  Fecha <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => { setFecha(e.target.value); setErrors(prev => ({ ...prev, fecha: '' })); }}
                  style={inputStyle(!!errors.fecha)}
                  onFocus={focusIn}
                  onBlur={e => focusOut(e, !!errors.fecha)}
                />
                {errors.fecha && <p className="text-xs" style={{ color: '#c0392b' }}>{errors.fecha}</p>}
              </div>
            </div>

            {/* Horario del turno */}
            <div className="rounded-xl p-4" style={{ backgroundColor: B_LIGHTER, border: `1px solid ${B_LIGHT}` }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa0b8', fontSize: 11 }}>
                    Horario del turno <span style={{ color: '#c0392b' }}>*</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1.5 rounded-lg font-semibold text-sm"
                      style={{
                        backgroundColor: horarioCambiado ? '#f1f4f9' : B_LIGHT,
                        color: horarioCambiado ? '#8fa0b8' : B_DARK,
                        textDecoration: horarioCambiado ? 'line-through' : 'none',
                        border: `1.5px solid ${horarioCambiado ? '#e2e8f0' : B_LIGHT}`,
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {HORARIO_TURNO_DEFAULT}
                    </span>
                    {!horarioCambiado && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                      >
                        Horario registrado
                      </span>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => { setHorarioCambiado(prev => !prev); setErrors(prev => ({ ...prev, horario: '' })); }}
                    className="rounded-md flex items-center justify-center shrink-0"
                    style={{
                      width: 18, height: 18,
                      backgroundColor: horarioCambiado ? B_MID : 'white',
                      border: `2px solid ${horarioCambiado ? B_MID : '#cdd5e0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {horarioCambiado && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#111827' }}>¿Hubo un cambio de horario?</span>
                </label>
              </div>

              {horarioCambiado && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #d1ddf5' }}>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>
                      Nuevo horario del turno <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={horarioOtro}
                        onChange={e => { setHorarioOtro(e.target.value); setErrors(prev => ({ ...prev, horario: '' })); }}
                        style={{ ...selectBase, maxWidth: 220, borderColor: errors.horario ? '#c0392b' : '#cdd5e0' }}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, !!errors.horario)}
                      >
                        <option value="">Seleccionar horario…</option>
                        {HORARIOS_TURNO_ALTERNATIVOS.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <input
                        type="text"
                        value={horarioOtro}
                        onChange={e => { setHorarioOtro(e.target.value); setErrors(prev => ({ ...prev, horario: '' })); }}
                        placeholder="O escriba: HH:MM - HH:MM"
                        style={{ ...inputBase, maxWidth: 180, borderColor: errors.horario ? '#c0392b' : '#cdd5e0' }}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, !!errors.horario)}
                      />
                    </div>
                    {errors.horario && <p className="text-xs" style={{ color: '#c0392b' }}>{errors.horario}</p>}
                  </div>
                  <p className="text-xs mt-2.5" style={{ color: '#8fa0b8' }}>
                    Si su horario fue modificado y el cambio aún no está registrado en la base de datos, indique el horario correspondiente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── SECCIÓN 2: ACTIVIDADES ACADÉMICAS ── */}
          <div style={cardStyle}>
            <SectionHeader num="2" title="Actividades Académicas Realizadas" badge="Opcional" />
            <p className="text-sm mb-5" style={{ color: '#5a6a82' }}>
              Registra las clases, prácticas, talleres, cursos u otras actividades desarrolladas en los laboratorios.
            </p>

            {actividadesAcademicas.length === 0 ? (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-8 text-center mb-3"
                style={{ backgroundColor: '#f8fafc', border: '1.5px dashed #cdd5e0' }}
              >
                <p className="text-sm mb-3" style={{ color: '#8fa0b8' }}>No hay actividades académicas registradas.</p>
                {addBtn(addActividad, 'Agregar actividad académica')}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {actividadesAcademicas.map((act, idx) => (
                  <div key={act.id} className="rounded-xl p-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#8fa0b8' }}>
                        Actividad #{idx + 1}
                      </span>
                      {removeBtn(() => removeActividad(act.id))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Sala</label>
                        <select value={act.sala} onChange={e => updateActividad(act.id, 'sala', e.target.value)} style={selectBase} onFocus={focusIn} onBlur={focusOut}>
                          <option value="">Seleccionar sala…</option>
                          {SALAS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Horario de la actividad</label>
                        <select value={act.horario} onChange={e => updateActividad(act.id, 'horario', e.target.value)} style={selectBase} onFocus={focusIn} onBlur={focusOut}>
                          <option value="">Seleccionar horario…</option>
                          {HORARIOS_ACADEMICOS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Docente / Responsable</label>
                        <select value={act.docente} onChange={e => updateActividad(act.id, 'docente', e.target.value)} style={selectBase} onFocus={focusIn} onBlur={focusOut}>
                          <option value="">Seleccionar docente…</option>
                          {DOCENTES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {act.docente === 'Otro' && (
                          <input
                            type="text"
                            value={act.docenteOtro}
                            onChange={e => updateActividad(act.id, 'docenteOtro', e.target.value)}
                            placeholder="Especificar docente / responsable"
                            style={inputBase}
                            onFocus={focusIn}
                            onBlur={focusOut}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Materia / Actividad</label>
                        <select value={act.materia} onChange={e => updateActividad(act.id, 'materia', e.target.value)} style={selectBase} onFocus={focusIn} onBlur={focusOut}>
                          <option value="">Seleccionar materia…</option>
                          {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        {act.materia === 'Otra' && (
                          <input
                            type="text"
                            value={act.materiaOtra}
                            onChange={e => updateActividad(act.id, 'materiaOtra', e.target.value)}
                            placeholder="Especificar materia / actividad"
                            style={inputBase}
                            onFocus={focusIn}
                            onBlur={focusOut}
                          />
                        )}
                      </div>
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Observaciones</label>
                        <textarea
                          value={act.observaciones}
                          onChange={e => updateActividad(act.id, 'observaciones', e.target.value)}
                          placeholder="Escriba alguna observación si corresponde…"
                          rows={2}
                          style={{ ...inputBase, resize: 'vertical' }}
                          onFocus={focusIn}
                          onBlur={focusOut}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {addBtn(addActividad, 'Agregar actividad académica')}
              </div>
            )}
          </div>

          {/* ── SECCIÓN 3: ACTIVIDADES LABORATORIO ── */}
          <div style={{ ...cardStyle, borderColor: errors.actividadesLab ? '#f5c6bc' : '#e2e8f0' }}>
            <SectionHeader num="3" title="Actividades Realizadas en el Laboratorio" badge="Obligatorio" badgeType="required" />
            <p className="text-sm mb-4" style={{ color: '#5a6a82' }}>
              Detalla las tareas de administración, soporte y funcionamiento realizadas durante el turno.
            </p>
            {errors.actividadesLab && <p className="text-xs mb-3" style={{ color: '#c0392b' }}>• {errors.actividadesLab}</p>}
            <div className="flex flex-col gap-3">
              {actividadesLab.map((act, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 mt-2"
                    style={{ width: 26, height: 26, backgroundColor: B_LIGHT, color: B_DARK }}
                  >
                    {i + 1}
                  </span>
                  <textarea
                    value={act}
                    onChange={e => { updateActividadLab(i, e.target.value); setErrors(prev => ({ ...prev, actividadesLab: '' })); }}
                    placeholder="Describa la actividad realizada…"
                    rows={2}
                    style={{ ...inputBase, resize: 'vertical', flex: 1 }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  {actividadesLab.length > 1 && (
                    <button
                      onClick={() => removeActividadLab(i)}
                      className="mt-2 p-1.5 rounded-lg shrink-0"
                      style={{ color: '#c0392b', backgroundColor: '#fdf0ee' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fde0dc'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fdf0ee'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">{addBtn(addActividadLab, 'Agregar actividad')}</div>
          </div>

          {/* ── SECCIÓN 4: INCIDENCIAS ── */}
          <div style={cardStyle}>
            <SectionHeader num="4" title="Incidencias y Observaciones" badge="Opcional" />
            <p className="text-sm mb-4" style={{ color: '#5a6a82' }}>
              Registra problemas, fallas, novedades o situaciones relevantes presentadas durante el turno.
            </p>
            {incidencias.length === 0 ? (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-7 text-center mb-3"
                style={{ backgroundColor: '#f8fafc', border: '1.5px dashed #cdd5e0' }}
              >
                <p className="text-sm mb-3" style={{ color: '#8fa0b8' }}>No se han registrado incidencias.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-3">
                {incidencias.map((inc, idx) => (
                  <div key={inc.id} className="rounded-xl p-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#8fa0b8' }}>Incidencia #{idx + 1}</span>
                      {removeBtn(() => removeIncidencia(inc.id))}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Equipo / Sala / Situación</label>
                        <input type="text" value={inc.equipo} onChange={e => updateIncidencia(inc.id, 'equipo', e.target.value)}
                          placeholder="Ej.: PC-15 / Sala 2 / Problema de conexión" style={inputBase} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Descripción</label>
                        <textarea value={inc.descripcion} onChange={e => updateIncidencia(inc.id, 'descripcion', e.target.value)}
                          placeholder="Describa la incidencia o situación presentada…" rows={2} style={{ ...inputBase, resize: 'vertical' }} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Acción realizada</label>
                        <textarea value={inc.accion} onChange={e => updateIncidencia(inc.id, 'accion', e.target.value)}
                          placeholder="Describa las acciones realizadas para solucionar o atender la situación…" rows={2} style={{ ...inputBase, resize: 'vertical' }} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {addBtn(addIncidencia, 'Agregar incidencia')}
          </div>

          {/* ── SECCIÓN 5: PENDIENTES ── */}
          <div style={cardStyle}>
            <SectionHeader num="5" title="Pendientes" badge="Opcional" />
            <p className="text-sm mb-4" style={{ color: '#5a6a82' }}>
              Registra actividades o requerimientos que no pudieron concluirse y deberán atenderse posteriormente.
            </p>
            <div className="flex flex-col gap-3 mb-3">
              {pendientes.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 mt-2"
                    style={{ width: 26, height: 26, backgroundColor: '#f1f4f9', color: '#5a6a82' }}
                  >
                    {i + 1}
                  </span>
                  <textarea
                    value={p}
                    onChange={e => updatePendiente(i, e.target.value)}
                    placeholder="Describa el pendiente…"
                    rows={2}
                    style={{ ...inputBase, resize: 'vertical', flex: 1 }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  {pendientes.length > 1 && (
                    <button
                      onClick={() => removePendiente(i)}
                      className="mt-2 p-1.5 rounded-lg shrink-0"
                      style={{ color: '#c0392b', backgroundColor: '#fdf0ee' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fde0dc'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fdf0ee'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5">{addBtn(addPendiente, 'Agregar pendiente')}</div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: '#111827' }}>Estado / Recomendación para el siguiente turno</label>
              <textarea
                value={estadoRecomendacion}
                onChange={e => setEstadoRecomendacion(e.target.value)}
                placeholder="Indique el estado actual o la recomendación para el siguiente turno…"
                rows={3}
                style={{ ...inputBase, resize: 'vertical' }}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>
        </div>

        {/* Sticky bar */}
        <div
          className="fixed bottom-0 right-0 no-print"
          style={{
            left: 220,
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 32px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
            zIndex: 40,
          }}
        >
          <button
            onClick={() => onNavigate(isEdit ? 'informes' : 'dashboard')}
            className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: '1.5px solid #cdd5e0', color: '#5a6a82', backgroundColor: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(37,84,168,0.28)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            {guardando
              ? 'Guardando...'
              : isEdit
                ? 'Guardar cambios'
                : 'Guardar informe'}
          </button>
        </div>
      </main>

      {showConfirm && <ConfirmModal onCancel={() => setShowConfirm(false)} onConfirm={handleConfirm} isEdit={isEdit} />}
    </div>
  );
}