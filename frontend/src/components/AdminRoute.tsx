import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  if (!user)    return <Navigate to="/login"     replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};