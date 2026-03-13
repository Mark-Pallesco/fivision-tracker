import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard/index';
import Income from '@/pages/Income/index';
import Expenses from '@/pages/Expenses/index';
import Clients from '@/pages/Clients/index';
import ClientDetail from '@/pages/Clients/ClientDetail';
import Projects from '@/pages/Projects/index';
import Reports from '@/pages/Reports/index';
import Settings from '@/pages/Settings/index';
import Login from '@/pages/Auth/Login';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="income" element={<Income />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
