import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { theme } from '../../theme'

export default function Mapa() {
  useFocusEffect(
    useCallback(() => {
      // ex.: recarregar marcadores no mapa
      // console.log('Mapa focado')
    }, [])
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Ver mapa de máquinas</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.PRETO
  },
  title: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.XL,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE
  }
})
