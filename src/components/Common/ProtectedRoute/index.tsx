import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BACKEND_URI from 'configs/env.config';
import { useAuth } from 'contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const {
    isAuthenticated: isSupabaseAuthenticated,
    isLoading: isAuthLoading,
    refreshKbAccess,
  } = useAuth();

  useEffect(() => {
    const verifyKbToken = async (token: string) => {
      try {
        const response = await fetch(`${BACKEND_URI}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          return true;
        }
        return false;
      } catch (error) {
        console.error('Token verification error:', error);
        return false;
      }
    };

    const verifyAccess = async () => {
      if (isAuthLoading) return;

      const token = localStorage.getItem('adminToken');
      if (token) {
        const tokenOk = await verifyKbToken(token);
        if (tokenOk) {
          setHasAccess(true);
          return;
        }
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }

      if (!isSupabaseAuthenticated) {
        setHasAccess(false);
        return;
      }

      const bridgedRole = await refreshKbAccess();
      let role = String(bridgedRole || '').toLowerCase();

      if (!role) {
        try {
          const raw = localStorage.getItem('adminUser');
          if (raw) {
            const parsed = JSON.parse(raw) as { role?: string };
            role = String(parsed?.role || '').toLowerCase();
          }
        } catch {
          role = '';
        }
      }

      if (role === 'admin' || role === 'editor' || role === 'viewer') {
        setHasAccess(true);
        return;
      }

      setHasAccess(false);
    };

    verifyAccess();
  }, [isAuthLoading, isSupabaseAuthenticated, refreshKbAccess]);

  // Still loading
  if (isAuthLoading || hasAccess === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" tip="Verifying access..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!hasAccess) {
    return <Navigate to="/sign-in" replace />;
  }

  // Authenticated - render children
  return children;
}
