// src/screens/Auth/Register.tsx

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export default function Register() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');
      const fullName = `${nome.trim()} ${sobrenome.trim()}`.trim();
      await register(fullName, email.trim(), senha);
      navigation.navigate('Login');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Erro no cadastro. Tente novamente.';
      setError(msg);
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Logo source={require('../../assets/Logo.png')} />

      <Form>
        <Label>Nome</Label>
        <InputRoxo
          placeholder="Seu nome"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={nome}
          onChangeText={setNome}
        />

        <Label>Sobrenome</Label>
        <InputVerde
          placeholder="Seu sobrenome"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Label>E-mail</Label>
        <InputVermelho
          placeholder="seu@email.com"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Label>Senha</Label>
        <InputAmarelo
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {!!error && <ErrorText>{error}</ErrorText>}

        <ButtonRegister onPress={handleRegister}>
          <ButtonRegisterText>CADASTRAR</ButtonRegisterText>
        </ButtonRegister>

        <ButtonLogin onPress={() => navigation.navigate('Login')}>
          <ButtonLoginText>LOGIN</ButtonLoginText>
        </ButtonLogin>
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
  margin-bottom: 6px;
  font-size: ${theme.FONT_SIZE.XL * 1.1}px;
`;

const BaseInput = styled.TextInput`
  background-color: transparent;
  color: ${theme.COLORS.WHITE};
  border-bottom-width: 2px;
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.MD}px;
  padding: 8px 0;
  margin-bottom: 24px;
`;

const InputRoxo = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.ROXO};
`;

const InputVerde = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.VERDE};
`;

const InputVermelho = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.VERMELHO};
`;

const InputAmarelo = styled(BaseInput)`
  border-bottom-color: ${theme.COLORS.AMARELO};
`;

const ErrorText = styled.Text`
  color: ${theme.COLORS.VERMELHO};
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.SM}px;
  margin-bottom: 16px;
  text-align: center;
`;

const ButtonRegister = styled.TouchableOpacity`
  background-color: ${theme.COLORS.BLUE};
  padding: 14px 0;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const ButtonRegisterText = styled.Text`
  color: ${theme.COLORS.PRETO};
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL}px;
  text-align: center;
`;

const ButtonLogin = styled.TouchableOpacity`
  background-color: ${theme.COLORS.VERMELHO};
  padding: 14px 0;
  border-radius: 8px;
`;

const ButtonLoginText = styled.Text`
  color: ${theme.COLORS.PRETO};
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL}px;
  text-align: center;
`;
