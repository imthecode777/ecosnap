import React, { createContext, useContext, useState } from 'react';

interface User {
  username: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateAvatar: (avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session-based auth - user must login each time they visit
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = user !== null;

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === '1234') {
      const savedAvatar = localStorage.getItem('ecosnap_avatar');
      const userData: User = {
        username: 'admin',
        name: 'Alex Chen',
        email: 'alex.chen@email.com',
        avatar: savedAvatar || null
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateAvatar = (avatar: string) => {
    if (user) {
      const updatedUser = { ...user, avatar };
      setUser(updatedUser);
      // Only persist avatar, not auth state
      localStorage.setItem('ecosnap_avatar', avatar);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
