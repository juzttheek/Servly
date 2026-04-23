import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseServices from './pages/BrowseServices';
import ServiceDetail from './pages/ServiceDetail';
import PostRequest from './pages/PostRequest';
import ProviderProfile from './pages/ProviderProfile';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminRegister from './admin/pages/AdminRegister';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminJobs from './admin/pages/AdminJobs';
import AdminRequests from './admin/pages/AdminRequests';
import AdminPayments from './admin/pages/AdminPayments';
import AdminReports from './admin/pages/AdminReports';
import AdminCreateUser from './admin/pages/AdminCreateUser';

import './styles/index.css';
import './styles/animations.css';

// Layout component to conditionally render Navbar/Footer
const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isChatPage = location.pathname === '/chat';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="page-wrapper">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<BrowseServices />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/post-request" element={<PostRequest />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/create-user" element={<AdminCreateUser />} />

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && !isChatPage && !isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <AppLayout />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
