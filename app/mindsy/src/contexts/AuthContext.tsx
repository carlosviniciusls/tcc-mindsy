import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  useEffect(() => {
    const carregar = async () => {
      const json = await AsyncStorage.getItem('usuario');
      if (json) setUsuario(JSON.parse(json));
    };
    carregar();
  }, []);

  const login = async (email: string, senha: string) => {
    const res = await api.post('/api/usuarios/login', { email, senha });
    const user = res.data.usuario;
    setUsuario(user);
    await AsyncStorage.setItem('usuario', JSON.stringify(user));
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post('/api/usuarios/registrar', { nome, email, senha });
  };

  const logout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
