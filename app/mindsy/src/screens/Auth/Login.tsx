// src/screens/Auth/Login.tsx

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email.trim(), senha);
    } catch {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Logo source={require('../../assets/Logo.png')} />

      <Form>
        <Label>E-mail</Label>
        <InputRoxo
          placeholder="seu@email.com"
          placeholderTextColor="rgba(255,255,255,0.6)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Label>Senha</Label>
        <InputVerde
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {!!error && <ErrorText>{error}</ErrorText>}

        <ButtonLogin onPress={handleLogin}>
          <ButtonTextLogin>LOGIN</ButtonTextLogin>
        </ButtonLogin>

        <ButtonRegister onPress={() => navigation.navigate('Register')}>
          <ButtonTextRegister>CADASTRO</ButtonTextRegister>
        </ButtonRegister>
      </Form>
    </Container>
  );
}

// Styled-components

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${theme.COLORS.PRETO};
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const Logo = styled.Image`
  width: 160px;
  height: 160px;
  margin-bottom: 32px;
`;

const Form = styled.View`
  width: 100%;
`;

const Label = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  color: ${theme.COLORS.WHITE};
  margin-bottom: 8px;
  font-size: ${theme.FONT_SIZE.XL * 1.1}px;
`;

const BaseInput = styled.TextInput`
  background-color: transparent;
  color: ${theme.COLORS.WHITE};
  border-bottom-width: 2px;
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.MD}px;
  padding: 12px 0;
  margin-bottom: 32px;
`;

const InputRoxo = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.VERMELHO};
`;

const InputVerde = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.BLUE};
`;

const ErrorText = styled.Text`
  color: ${theme.COLORS.VERMELHO};
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.SM}px;
  margin-bottom: 16px;
  text-align: center;
`;

const ButtonLogin = styled.TouchableOpacity`
  background-color: ${theme.COLORS.AMARELO};
  padding: 14px 0;
  border-radius: 8px;
  margin-bottom: 22px;
`;

const ButtonTextLogin = styled.Text`
  color: ${theme.COLORS.PRETO};
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL}px;
  text-align: center;
`;

const ButtonRegister = styled.TouchableOpacity`
  background-color: ${theme.COLORS.VERDE};
  padding: 14px 0;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const ButtonTextRegister = styled.Text`
  color: ${theme.COLORS.PRETO};
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL}px;
  text-align: center;
`;
