// src/screens/Auth/Splash.tsx
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DefaultTheme } from 'styled-components/native';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export default function Splash() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Splash'>>();

  return (
    <Container>
      <Title>Mindsy</Title>
      <Subtitle>
        Nossa tecnologia entrega livros. E a leitura te entrega ideias.
      </Subtitle>

      <Button onPress={() => navigation.navigate('Login')}>
        <ButtonText>VER APP</ButtonText>
      </Button>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.PRETO};
`;

const Title = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.XL}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
`;

const Subtitle = styled.Text`
  margin-top: 16px;
  margin-bottom: 40px;
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_FAMILY.INST_SANS};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.VERMELHO};
  padding: 14px 32px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.FONT_FAMILY.INST_SANS};
`;
