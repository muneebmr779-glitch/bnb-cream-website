import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('acp_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('acp_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((res) => {
        setUser(res.user);
        localStorage.setItem('acp_user', JSON.stringify(res.user));
      })
      .catch(() => {
        localStorage.removeItem('acp_token');
        localStorage.removeItem('acp_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem('acp_token', token);
    localStorage.setItem('acp_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        const res = await authService.login(credentials);
        persistSession(res.token, res.user);
        return { success: true, user: res.user };
      } catch (err) {
        return { success: false, message: getErrorMessage(err) };
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (data) => {
      try {
        const res = await authService.register(data);
        persistSession(res.token, res.user);
        return { success: true, user: res.user };
      } catch (err) {
        return { success: false, message: getErrorMessage(err) };
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('acp_token');
    localStorage.removeItem('acp_user');
    setUser(null);
  }, []);

  const updateUserData = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('acp_user', JSON.stringify(userData));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateUserData,
    }),
    [user, loading, login, register, logout, updateUserData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
