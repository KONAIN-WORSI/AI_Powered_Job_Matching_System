import { useState, type ReactNode } from 'react';
import { apiClient } from '../api/axios';
import { AuthContext } from './authContextValue';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => Boolean(localStorage.getItem('access_token')),
  );
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('user_role'));

  const login = (access: string, refresh: string, userRole: string, email: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('user_email', email);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');

    try {
      if (refresh) {
        await apiClient.post('/auth/logout/', { refresh });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_email');
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
