/* oxlint-disable react/only-export-components */
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import agent from '../api/agent';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const { user } = await agent.Auth.login(email, password);
    agent.token.save(user.token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { user } = await agent.Auth.register(username, email, password);
    agent.token.save(user.token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  }, []);

  const logout = useCallback(() => {
    agent.token.destroy();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback(async (fields) => {
    const { user } = await agent.Auth.save(fields);
    setCurrentUser(user);
    return user;
  }, []);

  // Verify auth on mount (replaces app.run verifyAuth + resolve)
  useEffect(() => {
    const verify = async () => {
      const jwt = agent.token.get();
      if (!jwt) {
        setIsLoading(false);
        return;
      }
      try {
        const { user } = await agent.Auth.current();
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch {
        agent.token.destroy();
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [currentUser, isAuthenticated, isLoading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export { useAuth } from './useAuth';

