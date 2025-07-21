// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string) => {
    const res = await api.post('/api/usuarios/login', { email, senha });
    const user = res.data.usuario as Usuario;
    setUsuario(user);
    // sem persistência em AsyncStorage
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post('/api/usuarios/registrar', { nome, email, senha });
  };

  const logout = () => {
    setUsuario(null);
    // sem remoção de AsyncStorage
  };

  return (
    <AuthContext.Provider value={{ usuario, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
