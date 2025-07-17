import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      setErro('');
      await login(email, senha);
      // se login for bem-sucedido, o Routes redireciona automaticamente
    } catch (err: any) {
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <Container>
      <Title>Entrar</Title>

      <Input placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#999" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} placeholderTextColor="#999" secureTextEntry />

      {erro ? <ErrorText>{erro}</ErrorText> : null}

      <Button onPress={handleLogin}>
        <ButtonText>ACESSAR</ButtonText>
      </Button>

      <LinkText onPress={() => navigation.navigate('Register')}>
        Ainda não tem conta? Cadastre-se
      </LinkText>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 32px;
  justify-content: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.PRETO};
`;

const Title = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.XL}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  margin-bottom: 32px;
`;

const Input = styled.TextInput`
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.MD}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.VERMELHO};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_FAMILY.INST_SANS};
`;

const LinkText = styled.Text`
  margin-top: 24px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.SM}px;
  text-align: center;
  text-decoration: underline;
`;

const ErrorText = styled.Text`
  color: #ff9999;
  text-align: center;
  margin-bottom: 12px;
`;