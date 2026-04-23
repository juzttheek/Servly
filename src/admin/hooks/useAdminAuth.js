import { useAdminAuth as useAdminAuthContext } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminAuth = () => {
  const context = useAdminAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.isLoading && !context.isAdmin) {
      navigate('/admin/login');
    }
  }, [context.isLoading, context.isAdmin, navigate]);

  return context;
};

export const useAdminPermission = (permission) => {
  const { hasPermission } = useAdminAuthContext();
  return hasPermission(permission);
};
