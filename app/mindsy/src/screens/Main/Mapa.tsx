// src/screens/Main/Mapa.tsx
import React, { useCallback } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Linking,
  Alert
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { theme } from '../../theme'

const CENTER = {
  latitude: -23.53525851876796,
  longitude: -46.58520119189919
} as const

const initialRegion: Region = {
  latitude: CENTER.latitude,
  longitude: CENTER.longitude,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012
}

export default function Mapa() {
  const openInMaps = useCallback(async () => {
    const lat = CENTER.latitude
    const lon = CENTER.longitude

    // URLs nativas / fallback
    const googleScheme = Platform.select({
      ios: `comgooglemaps://?q=${lat},${lon}&zoom=17`,
      android: `geo:${lat},${lon}?q=${lat},${lon}`
    })
    const universalUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`

    try {
      if (googleScheme && (await Linking.canOpenURL(googleScheme))) {
        await Linking.openURL(googleScheme)
        return
      }
      if (await Linking.canOpenURL(universalUrl)) {
        await Linking.openURL(universalUrl)
        return
      }
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.')
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.')
    }
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          zoomControlEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: CENTER.latitude, longitude: CENTER.longitude }}
            title="Maquina Etec Parque Belém"
            description="Rua Ulisses Cruz, 85"
          />
        </MapView>

        <View style={styles.actionWrap}>
          <TouchableOpacity style={styles.button} onPress={openInMaps}>
            <Text style={styles.buttonText}>Abrir Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO
  },
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  actionWrap: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  button: {
    backgroundColor: theme.COLORS.AMARELO,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 4
  },
  buttonText: {
    color: theme.COLORS.PRETO,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: 16
  }
})
