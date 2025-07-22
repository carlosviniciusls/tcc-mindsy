import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Buscar, { Livro } from '../screens/Main/Buscar';
import LivroDetalhes from '../screens/Main/BookDetail';

export type BuscarStackParamList = {
  BuscarMain: undefined;
  LivroDetalhes: { book: Livro };
};

const Stack = createNativeStackNavigator<BuscarStackParamList>();

export default function BuscarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuscarMain" component={Buscar} />
      <Stack.Screen name="LivroDetalhes" component={LivroDetalhes} />
    </Stack.Navigator>
  );
}
