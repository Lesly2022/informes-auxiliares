import { useEffect, useState } from 'react';
import type { AdminScreen, Screen } from './types';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import InformeFormScreen from './screens/InformeFormScreen';
import InformesPasadosScreen from './screens/InformesPasadosScreen';
import InformesCompartidosScreen from './screens/InformesCompartidosScreen';
import VisualizarInformeScreen from './screens/VisualizarInformeScreen';

import AdminMateriasScreen from './screens/admin/AdminMateriasScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminInformesScreen from './screens/admin/AdminInformesScreen';
import AdminAuxiliaresScreen from './screens/admin/AdminAuxiliaresScreen';
import AdminDocentesScreen from './screens/admin/AdminDocentesScreen';
import AdminSalasScreen from './screens/admin/AdminSalasScreen';
import AdminVisualizarInformeScreen from './screens/admin/AdminVisualizarInformeScreen';
import AdminImprimirInformesScreen from './screens/admin/AdminImprimirInformesScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
      const token = sessionStorage.getItem('token');
      const usuarioGuardado = sessionStorage.getItem('usuario');
      const pantallaGuardada = sessionStorage.getItem('screen') as Screen | null;

      if (token) {
        try {
          const partes = token.split('.');

          if (partes.length !== 3) {
            throw new Error('Token inválido');
          }

          const payload = JSON.parse(
            atob(
              partes[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/')
            )
          );

          if (
            typeof payload.exp !== 'number' ||
            payload.exp * 1000 <= Date.now()
          ) {
            throw new Error('Token expirado');
          }
        } catch {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('usuario');
          sessionStorage.removeItem('screen');
          return 'login';
        }
      }


      if (!token || !usuarioGuardado) {
        return 'login';
      }

      try {
        const usuario = JSON.parse(usuarioGuardado);

        if (pantallaGuardada) {
          const esPantallaAdmin = pantallaGuardada.startsWith('admin-');

          if (usuario.rol === 'ADMIN' && esPantallaAdmin) {
            return pantallaGuardada;
          }

          if (
            usuario.rol === 'AUXILIAR' &&
            !esPantallaAdmin &&
            pantallaGuardada !== 'login'
          ) {
            return pantallaGuardada;
          }
        }

        if (usuario.rol === 'ADMIN') {
          return 'admin-dashboard';
        }

        if (usuario.rol === 'AUXILIAR') {
          return 'dashboard';
        }

        return 'login';
      } catch {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('screen');
        return 'login';
      }
    });
  const [selectedId, setSelectedId] = useState<string | null>(null);
useEffect(() => {
  const manejarSesionExpirada = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('screen');

    setSelectedId(null);
    setScreen('login');
  };

  window.addEventListener(
    'sesion-expirada',
    manejarSesionExpirada
  );

  return () => {
    window.removeEventListener(
      'sesion-expirada',
      manejarSesionExpirada
    );
  };
}, []);


  const navigate = (s: Screen, id?: string) => {
      setScreen(s);
      sessionStorage.setItem('screen', s);

      if (id !== undefined) {
        setSelectedId(id);
      }

      window.scrollTo(0, 0);
    };

  const navigateAdmin = (screen: AdminScreen, id?: string) => {
    navigate(screen, id);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('screen');

    setScreen('login');
    setSelectedId(null);
  };

  switch (screen) {
    /*
     * LOGIN
     */
    case 'login':
      return <LoginScreen onLogin={navigate} />;

    /*
     * AUXILIAR
     */
    case 'dashboard':
      return (
        <DashboardScreen
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    case 'elaborar':
      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          editReportId={null}
        />
      );

    case 'editar':
      if (!selectedId) {
        return (
          <InformesPasadosScreen
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          editReportId={selectedId}
        />
      );

    case 'informes':
      return (
            <InformesPasadosScreen
              onNavigate={navigate}
              onLogout={handleLogout}
            />
          );

        case 'informes-compartidos':
      return (
        <InformesCompartidosScreen
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    case 'visualizar':
      if (!selectedId) {
        return (
          <InformesPasadosScreen
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <VisualizarInformeScreen
          informeId={selectedId}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    /*
     * ADMINISTRADOR
     */
    case 'admin-dashboard':
      return (
        <AdminDashboardScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-informes':
      return (
        <AdminInformesScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );
    
    case 'admin-imprimir':
      return (
        <AdminImprimirInformesScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-visualizar':
      if (!selectedId) {
        return (
          <AdminInformesScreen
            onNavigate={navigateAdmin}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <AdminVisualizarInformeScreen
          informeId={selectedId}
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-auxiliares':
      return (
        <AdminAuxiliaresScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-docentes':
      return (
        <AdminDocentesScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-salas':
      return (
        <AdminSalasScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    case 'admin-materias':
      return (
        <AdminMateriasScreen
          onNavigate={navigateAdmin}
          onLogout={handleLogout}
        />
      );

    default:
      return null;
  }
}