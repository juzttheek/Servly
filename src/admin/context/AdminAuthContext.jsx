import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminUser, updateAdminPermissions } from '../utils/firebaseAdmin';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAdminData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const adminData = await getAdminUser(currentUser.uid);
        if (adminData) {
          setAdminUser(adminData);
          setAdminRole(adminData.role);
          setPermissions(adminData.permissions || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [currentUser]);

  const hasPermission = (permission) => {
    if (!adminRole) return false;
    return permissions.includes(permission) || adminRole === 'super_admin';
  };

  const value = {
    adminUser,
    adminRole,
    permissions,
    isLoading,
    error,
    isAdmin: !!adminUser,
    hasPermission,
    updatePermissions: async (newPermissions) => {
      if (!currentUser) return;
      try {
        await updateAdminPermissions(currentUser.uid, newPermissions);
        setPermissions(newPermissions);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
