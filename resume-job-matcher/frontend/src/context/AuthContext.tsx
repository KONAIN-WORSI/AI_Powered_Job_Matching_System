import { createContext, useState, type ReactNode } from 'react';
import { apiClient } from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (access: string, refresh: string, role: string) => void;
  logout: () => Promise<void>;
  role: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => Boolean(localStorage.getItem('access_token')),
  );
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('user_role'));

  const login = (access: string, refresh: string, userRole: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_role', userRole);
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
