// src/screens/Auth/Splash.tsx

import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
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
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <Background
      colors={['#0B0C10', '#161821']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <GlowTop />
      <GlowBottom />

      <Content>
        <Title>MINDSY MACHINE</Title>

        <Tagline>
          NOSSA TECNOLOGIA ENTREGA <Green>livros</Green>.{'\n'}
          E A LEITURA TE ENTREGA <Yellow>ideias</Yellow>.
        </Tagline>

        <EnterButton onPress={() => navigation.navigate('Login')}>
          <EnterText>VER APP</EnterText>
        </EnterButton>
      </Content>
    </Background>
  );
}

// 💅 Styled Components

const Background = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const GlowTop = styled.View`
  position: absolute;
  top: -160px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 180px;
  background-color: ${theme.COLORS.BLUE};
  opacity: 0.35;
`;

const GlowBottom = styled.View`
  position: absolute;
  bottom: -160px;
  left: -120px;
  width: 320px;
  height: 320px;
  border-radius: 160px;
  background-color: ${theme.COLORS.VERMELHO};
  opacity: 0.35;
`;

const Content = styled.View`
  padding: 0 32px;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL * 3}px;
  color: ${theme.COLORS.WHITE};
  margin-bottom: 32px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const Tagline = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL * 1.1}px;
  color: ${theme.COLORS.WHITE};
  text-align: center;
  line-height: 30px;
  margin-bottom: 48px;
`;

const Green = styled.Text`
  color: ${theme.COLORS.VERDE};
`;

const Yellow = styled.Text`
  color: ${theme.COLORS.AMARELO};
`;

const EnterButton = styled(Pressable)`
  border: 2px solid ${theme.COLORS.WHITE};
  background-color: transparent;
  padding: 16px 68px;
  border-radius: 10px;
`;

const EnterText = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL}px;
  color: ${theme.COLORS.WHITE};
  letter-spacing: 0px;
`;
