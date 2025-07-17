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

export default function Register() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleRegister = async () => {
    try {
      setErro('');
      setSucesso('');
      await register(nome, email, senha);
      setSucesso('Cadastro realizado com sucesso!');
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (err: any) {
      setErro('Erro ao cadastrar. Verifique os dados.');
    }
  };

  return (
    <Container>
      <Title>Cadastro</Title>

      <Input placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
      <Input placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#999" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} placeholderTextColor="#999" secureTextEntry />

      {erro ? <ErrorText>{erro}</ErrorText> : null}
      {sucesso ? <SuccessText>{sucesso}</SuccessText> : null}

      <Button onPress={handleRegister}>
        <ButtonText>CRIAR CONTA</ButtonText>
      </Button>

      <LinkText onPress={() => navigation.navigate('Login')}>
        Já tem conta? Entrar
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

const SuccessText = styled.Text`
  color: #00ffcc;
  text-align: center;
  margin-bottom: 12px;
`;