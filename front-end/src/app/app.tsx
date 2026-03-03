import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../components/shared/DashboardLayout';
import ClientsPage from '../pages/ClientsPage';

export function App() {
  return (
    <div>
      {/* <LoginPage /> */}
      <DashboardLayout>
        <ClientsPage />
      </DashboardLayout>
    </div>
  );
}

export default App;
