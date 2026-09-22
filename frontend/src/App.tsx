import { useState } from 'react';
import type { AdminScreen, Screen } from './types';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import InformeFormScreen from './screens/InformeFormScreen';
import InformesPasadosScreen from './screens/InformesPasadosScreen';
import VisualizarInformeScreen from './screens/VisualizarInformeScreen';

import AdminMateriasScreen from './screens/admin/AdminMateriasScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminInformesScreen from './screens/admin/AdminInformesScreen';
import AdminAuxiliaresScreen from './screens/admin/AdminAuxiliaresScreen';
import AdminDocentesScreen from './screens/admin/AdminDocentesScreen';
import AdminSalasScreen from './screens/admin/AdminSalasScreen';
import AdminVisualizarInformeScreen from './screens/admin/AdminVisualizarInformeScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = (s: Screen, id?: string) => {
    setScreen(s);

    if (id !== undefined) {
      setSelectedId(id);
    }

    window.scrollTo(0, 0);
  };

  const navigateAdmin = (screen: AdminScreen, id?: string) => {
    navigate(screen, id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

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