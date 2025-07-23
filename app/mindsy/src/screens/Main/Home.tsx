import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { theme } from '../../theme'

export default function Home() {
  // Hook disparado sempre que a tela fica em foco
  useFocusEffect(
    useCallback(() => {
      // Aqui você poderia, por exemplo,
      // recarregar dados que populam essa tela
      // console.log('Home focada')
    }, [])
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Bem-vindo ao Mindsy!</Text>
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
