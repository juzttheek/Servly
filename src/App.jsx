import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

import './styles/index.css';
import './styles/animations.css';

// Layout component to conditionally render Navbar/Footer
const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="page-wrapper">
      {!isAuthPage && <Navbar />}
      <Routes>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && !isChatPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
