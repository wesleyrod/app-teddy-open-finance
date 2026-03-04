import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientsPage from '@/features/clients/pages/ClientsPage';
import SelectedClientsPage from '@/features/clients/pages/SelectedClientsPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import { ClientsProvider } from '@/features/clients/contexts/ClientsContext';
import { AuthProvider, useAuth } from '@/features/auth/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ClientsProvider>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<ClientsPage />} />
                  <Route path="/selected" element={<SelectedClientsPage />} />
                </Routes>
              </DashboardLayout>
            </ClientsProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
