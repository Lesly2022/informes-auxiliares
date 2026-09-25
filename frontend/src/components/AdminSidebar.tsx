import type { AdminScreen } from '../types';

interface AdminSidebarProps {
  active: AdminScreen;
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

const navItems: {
  label: string;
  screen: AdminScreen;
  icon: string;
}[] = [
  { label: 'Inicio', screen: 'admin-dashboard', icon: 'home' },
  { label: 'Informes', screen: 'admin-informes', icon: 'list' },
  { label: 'Auxiliares', screen: 'admin-auxiliares', icon: 'users' },
  { label: 'Docentes', screen: 'admin-docentes', icon: 'teacher' },
  { label: 'Salas', screen: 'admin-salas', icon: 'room' },
  { label: 'Materias', screen: 'admin-materias', icon: 'book' },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );

    case 'list':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );

    case 'users':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case 'teacher':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          <path d="M19 5h3" />
          <path d="M20.5 3.5v3" />
        </svg>
      );

    case 'room':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          <path d="M9 9h6" />
          <path d="M9 13h6" />
          <path d="M9 17h2" />
        </svg>
      );

    case 'book':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ); 

    case 'logout':
      return (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    default:
      return null;
  }
}

const SIDEBAR_BG = '#1a3d7c';

export default function AdminSidebar({
  active,
  onNavigate,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside
      style={{
        backgroundColor: SIDEBAR_BG,
        height: '100vh',
        width: 220,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
      }}
      className="flex flex-col"
    >
      {/* Encabezado */}
      <div
        className="px-5 py-6 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.10)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              backgroundColor: 'white',
              width: 42,
              height: 42,
            }}
          >
            <img
              src="/logo-informes.jpeg"
              alt="SILAB"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div>
            <div
              className="text-white font-semibold text-sm leading-tight"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              SILAB - Sistema de Informes de Laboratorio
            </div>

            <div
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 11,
              }}
            >
              Panel administrador
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = active === item.screen;

          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left"
              style={{
                backgroundColor: isActive
                  ? 'rgba(255,255,255,0.16)'
                  : 'transparent',
                color: isActive
                  ? 'white'
                  : 'rgba(255,255,255,0.68)',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.72 }}>
                <Icon name={item.icon} />
              </span>

              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Sesión */}
      <div
        className="px-3 pb-5 pt-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.10)' }}
      >
        <div
          className="px-3 pb-3"
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 10,
          }}
        >
          ADMINISTRADOR
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left"
          style={{ color: 'rgba(255,255,255,0.62)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color =
              'rgba(255,255,255,0.62)';
          }}
        >
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}