import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Livro } from '../screens/Main/Buscar';

type FavoritesContextType = {
  favorites: Livro[];
  addFavorite: (livro: Livro) => void;
  removeFavorite: (livroId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Livro[]>([]);

  const addFavorite = (livro: Livro) => {
    setFavorites(prev =>
      prev.some(l => l.id === livro.id) ? prev : [...prev, livro]
    );
  };

  const removeFavorite = (livroId: number) => {
    setFavorites(prev => prev.filter(l => l.id !== livroId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return context;
}
