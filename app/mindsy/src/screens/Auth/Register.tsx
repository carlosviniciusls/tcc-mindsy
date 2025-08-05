import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    if (!nome.trim() || !sobrenome.trim() || !email.trim() || !senha) {
      setError('Preencha todos os campos antes de cadastrar.');
      return;
    }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Image source={require('../../assets/Logo.png')} style={styles.logo} />

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.ROXO }]}
          placeholder="Seu nome"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.VERDE }]}
          placeholder="Seu sobrenome"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.VERMELHO }]}
          placeholder="seu@email.com"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.inputBase, { borderBottomColor: theme.COLORS.AMARELO }]}
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
          <Text style={styles.buttonRegisterText}>CADASTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonLoginText}>LOGIN</Text>
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
    marginBottom: 6,
    fontSize: theme.FONT_SIZE.XL * 1.1,
  },
  inputBase: {
    backgroundColor: 'transparent',
    color: theme.COLORS.WHITE,
    borderBottomWidth: 2,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.MD,
    paddingVertical: 8,
    marginBottom: 24,
  },
  errorText: {
    color: theme.COLORS.VERMELHO,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.SM,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRegister: {
    backgroundColor: theme.COLORS.BLUE,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonRegisterText: {
    color: theme.COLORS.PRETO,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL,
    textAlign: 'center',
  },
  buttonLogin: {
    backgroundColor: theme.COLORS.VERMELHO,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonLoginText: {
    color: theme.COLORS.PRETO,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL,
    textAlign: 'center',
  },
});
