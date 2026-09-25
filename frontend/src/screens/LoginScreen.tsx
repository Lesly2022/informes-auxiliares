import { useState } from 'react';
import type { Screen } from '../types';
import { login } from '../services/auth.service';

interface Props {
  onLogin: (s: Screen) => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';

export default function LoginScreen({ onLogin }: Props) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usuarioLimpio = usuario.trim();
    const passwordLimpio = password.trim();

    if (!usuarioLimpio || !passwordLimpio) {
      setError('Por favor, completa todos los campos.');
      return;
    }

      setLoading(true);

      try {
        const data = await login(
          usuarioLimpio,
          passwordLimpio,
        );

        localStorage.setItem('token', data.token);
        localStorage.setItem(
          'usuario',
          JSON.stringify(data.usuario),
        );

        if (data.usuario.rol === 'ADMIN') {
          onLogin('admin-dashboard');
          return;
        }

        if (data.usuario.rol === 'AUXILIAR') {
          onLogin('dashboard');
          return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setError(
          'El usuario no tiene un rol válido para acceder al sistema.',
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('No se pudo iniciar sesión.');
        }
      } finally {
        setLoading(false);
      }

  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#f1f4f9' }}
    >
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: 440,
          backgroundColor: 'white',
          boxShadow:
            '0 4px 32px rgba(26,61,124,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* HEADER */}
        <div
          className="px-8 pt-8 pb-7 flex flex-col items-center text-center"
          style={{
            background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
          }}
        >
          <div
            className="rounded-xl flex items-center justify-center mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              width: 54,
              height: 54,
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
              <rect
                x="2"
                y="3"
                width="20"
                height="14"
                rx="2"
                ry="2"
              />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <h1
            className="text-white font-bold text-xl leading-tight"
            style={{
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Sistema de Informes Diarios
          </h1>

          <p
            className="text-sm mt-1.5"
            style={{
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            Laboratorios de Cómputo – Informática y Sistemas
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Universidad Mayor de San Simón
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="px-8 py-7">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* USUARIO */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: '#111827' }}
              >
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) =>
                  setUsuario(e.target.value)
                }
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={{
                  border: '1.5px solid #cdd5e0',
                  backgroundColor: '#f8fafc',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = B_MID;
                  e.currentTarget.style.backgroundColor =
                    'white';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    '#cdd5e0';
                  e.currentTarget.style.backgroundColor =
                    '#f8fafc';
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: '#111827' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={{
                  border: '1.5px solid #cdd5e0',
                  backgroundColor: '#f8fafc',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = B_MID;
                  e.currentTarget.style.backgroundColor =
                    'white';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    '#cdd5e0';
                  e.currentTarget.style.backgroundColor =
                    '#f8fafc';
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-3.5 py-2.5 text-sm"
                style={{
                  backgroundColor: '#fdf0ee',
                  color: '#c0392b',
                  border: '1px solid #f5c6bc',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white mt-1"
              style={{
                background: loading
                  ? B_MID
                  : `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow:
                  '0 2px 8px rgba(37,84,168,0.30)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = '0.92';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeOpacity="0.25"
                    />

                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      strokeLinecap="round"
                    />
                  </svg>
                  Verificando…
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p
            className="text-center text-xs mt-5"
            style={{ color: '#5a6a82' }}
          >
            Ingresa tus credenciales para acceder al sistema.
          </p>
        </div>
      </div>

      <p
        className="text-xs mt-6"
        style={{ color: '#8fa0b8' }}
      >
        UMSS · Carrera de Informática y Sistemas · Laboratorios de Informática y Sistemas
      </p>
    </div>
  );
}