// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type AuthContextType = {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateProfile: (nome: string) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string) => {
    const res = await api.post('/api/usuarios/login', { email, senha });
    setUsuario(res.data.usuario);
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post('/api/usuarios/registrar', { nome, email, senha });
  };

  const logout = () => {
    setUsuario(null);
  };

  const updateProfile = async (nome: string) => {
    if (!usuario) return;
    const res = await api.put(`/api/usuarios/${usuario.id}/nome`, { nome });
    setUsuario(res.data.usuario);
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!usuario) return;
    await api.patch(`/api/usuarios/${usuario.id}/senha`, {
      oldPassword: oldPass,
      newPassword: newPass
    });
  };

  return (
    <AuthContext.Provider 
      value={{ usuario, login, register, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
