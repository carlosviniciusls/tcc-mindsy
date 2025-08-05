// src/screens/Auth/Splash.tsx

import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../theme';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export default function Splash() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <LinearGradient
      colors={['#0B0C10', '#161821']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        <Text style={styles.title}>MINDSY MACHINE</Text>

        <Text style={styles.tagline}>
          NOSSA TECNOLOGIA ENTREGA <Text style={styles.green}>livros</Text>.{'\n'}
          E A LEITURA TE ENTREGA <Text style={styles.yellow}>ideias</Text>.
        </Text>

        <Pressable
          style={styles.enterButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.enterText}>VER APP</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: -160,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: theme.COLORS.BLUE,
    opacity: 0.35,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: theme.COLORS.VERMELHO,
    opacity: 0.35,
  },
  content: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL * 3,
    color: theme.COLORS.WHITE,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL * 1.1,
    color: theme.COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 48,
  },
  green: {
    color: theme.COLORS.VERDE,
  },
  yellow: {
    color: theme.COLORS.AMARELO,
  },
  enterButton: {
    borderWidth: 2,
    borderColor: theme.COLORS.WHITE,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 68,
    borderRadius: 10,
  },
  enterText: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL,
    color: theme.COLORS.WHITE,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
