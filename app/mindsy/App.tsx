// App.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { AuthProvider } from './src/contexts/AuthContext'
import { FavoritesProvider } from './src/contexts/FavoriteContext'
import Routes from './src/navigation'

export default function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': require('./src/assets/fonts/BebasNeue-Regular.ttf'),
    'InstrumentSans-Medium': require('./src/assets/fonts/InstrumentSans-Medium.ttf'),
  })

  // bloqueia a splash até estarmos prontos
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(console.warn)
  }, [])

  // esconde a splash quando as fontes carregarem
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.warn)
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />
  }

  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="light" translucent />
        <Routes />
      </FavoritesProvider>
    </AuthProvider>
  )
}
