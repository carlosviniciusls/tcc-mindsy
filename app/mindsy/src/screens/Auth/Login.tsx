import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export default function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // validação básica de campos
    if (!email.trim() || !senha) {
      setError('Preencha e-mail e senha antes de entrar.');
      return;
    }

    try {
      setError('');
      await login(email.trim(), senha);
      // se seu fluxo estiver configurado para trocar de stack ao setUsuario(),
      // não é necessário chamar navigation aqui
    } catch {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Image source={require('../../assets/Logo.png')} style={styles.logo} />

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.VERMELHO }]}
          placeholder="seu@email.com"
          placeholderTextColor="rgba(255,255,255,0.6)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.BLUE }]}
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <Text style={styles.buttonTextLogin}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonTextRegister}>CADASTRO</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    color: theme.COLORS.WHITE,
    marginBottom: 8,
    fontSize: theme.FONT_SIZE.XL * 1.1,
  },
  inputBase: {
    backgroundColor: 'transparent',
    color: theme.COLORS.WHITE,
    borderBottomWidth: 2,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.MD,
    paddingVertical: 12,
    marginBottom: 32,
  },
  errorText: {
    color: theme.COLORS.VERMELHO,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.SM,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonLogin: {
    backgroundColor: theme.COLORS.AMARELO,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 22,
  },
  buttonTextLogin: {
    color: theme.COLORS.PRETO,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL,
    textAlign: 'center',
  },
  buttonRegister: {
    backgroundColor: theme.COLORS.VERDE,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonTextRegister: {
    color: theme.COLORS.PRETO,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL,
    textAlign: 'center',
  },
});
