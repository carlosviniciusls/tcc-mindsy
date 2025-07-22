// src/navigation/FavoritosStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favoritos from '../screens/Main/Favoritos';
import LivroDetalhes from '../screens/Main/BookDetail';
import type { Livro } from '../screens/Main/Buscar';

export type FavoritosStackParamList = {
  FavoritosMain: undefined;
  LivroDetalhes: { book: Livro };
};

const Stack = createNativeStackNavigator<FavoritosStackParamList>();

export default function FavoritosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritosMain" component={Favoritos} />
      <Stack.Screen name="LivroDetalhes" component={LivroDetalhes} />
    </Stack.Navigator>
  );
}
