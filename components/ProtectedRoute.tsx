'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication();

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/authentication');
    }
  }, []);

  return <>{children}</>;
};

const checkUserAuthentication = (): boolean => {
  const vendor_token = localStorage.getItem('vendor_token');

  if (vendor_token) {
    return true;
  }

  return false;
};

export default ProtectedRoute;
