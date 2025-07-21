// App.tsx

import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { theme } from './src/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/navigation';

// Impede que a splash seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': require('./src/assets/fonts/BebasNeue-Regular.ttf'),
    'InstrumentSans-Medium': require('./src/assets/fonts/InstrumentSans-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Enquanto as fontes não carregam, mantemos a splash
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" translucent />
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
