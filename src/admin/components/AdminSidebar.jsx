import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import '../styles/AdminSidebar.css';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, hasPermission, adminRole } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      permission: PERMISSIONS.VIEW_DASHBOARD,
      badge: null
    },
    {
      label: 'Users',
      icon: Users,
      href: '/admin/users',
      permission: PERMISSIONS.VIEW_USERS,
      badge: null
    },
    {
      label: 'Jobs',
      icon: FileText,
      href: '/admin/jobs',
      permission: PERMISSIONS.VIEW_JOBS,
      badge: 'pending'
    },
    {
      label: 'Requests',
      icon: MessageSquare,
      href: '/admin/requests',
      permission: PERMISSIONS.VIEW_REQUESTS,
      badge: 'pending'
    },
    {
      label: 'Payments',
      icon: CreditCard,
      href: '/admin/payments',
      permission: PERMISSIONS.VIEW_PAYMENTS,
      badge: null
    },
    {
      label: 'Reports',
      icon: BarChart3,
      href: '/admin/reports',
      permission: PERMISSIONS.VIEW_REPORTS,
      badge: null
    },
    {
      label: 'Audit Logs',
      icon: LogIn,
      href: '/admin/logs',
      permission: PERMISSIONS.VIEW_LOGS,
      badge: null
    },
    {
      label: 'Create Admin',
      icon: UserPlus,
      href: '/admin/create-user',
      permission: PERMISSIONS.MANAGE_ADMINS,
      badge: null
    }
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="admin-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Close button for mobile */}
        <button
          className="admin-sidebar-close"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <Link to="/admin/dashboard" className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">S</div>
          <span>Servly Admin</span>
        </Link>

        {/* Admin Info */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-avatar">{adminUser?.name?.charAt(0)}</div>
          <div className="admin-sidebar-user-info">
            <p className="admin-sidebar-user-name">{adminUser?.name}</p>
            <p className="admin-sidebar-user-role">{adminRole}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-nav">
          {filteredMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Admin Settings (for super_admin) */}
        {adminRole === 'super_admin' && (
          <div className="admin-sidebar-settings">
            <Link to="/admin/settings" className="admin-nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <button className="admin-sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="admin-sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default AdminSidebar;
