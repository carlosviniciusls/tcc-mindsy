import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';

type EditProfileNavProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'EditProfile'
>;

export default function EditProfile() {
  const navigation = useNavigation<EditProfileNavProp>();
  const { usuario, updateProfile, changePassword } = useAuth();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');

  const handleSaveName = async () => {
    if (!nome.trim()) {
      setError('Nome não pode ficar vazio.');
      return;
    }
    try {
      setError('');
      await updateProfile(nome.trim());
      Alert.alert('Sucesso', 'Nome atualizado!');
    } catch {
      setError('Falha ao atualizar nome.');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) {
      setError('Preencha senha atual e nova senha.');
      return;
    }
    try {
      setError('');
      await changePassword(oldPass, newPass);
      Alert.alert('Sucesso', 'Senha alterada!');
      setOldPass('');
      setNewPass('');
    } catch {
      setError('Falha ao alterar senha.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Conta</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.COLORS.ROXO }]}
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.COLORS.ROXO }]}
          onPress={handleSaveName}
        >
          <Text style={styles.buttonText}>Salvar Nome</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Senha Atual</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.COLORS.ROXO }]}
          placeholder="Senha atual"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={oldPass}
          onChangeText={setOldPass}
        />

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.COLORS.ROXO }]}
          placeholder="Nova senha"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={newPass}
          onChangeText={setNewPass}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.COLORS.VERDE }]}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Salvar Senha</Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO,
    paddingHorizontal: 24
  },
  content: {
    paddingVertical: 32
  },
  title: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.XL*1.5,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    marginTop: 48,
    marginBottom: 24,
    textAlign: 'center'
  },
  label: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.MD,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    marginBottom: 8
  },
  input: {
    borderWidth: 2,
    borderRadius: 6,
    color: theme.COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontFamily: theme.FONT_FAMILY.INST_SANS
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center'
  },
  buttonText: {
    color: theme.COLORS.PRETO,
    fontSize: theme.FONT_SIZE.MD,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE
  },
  error: {
    color: theme.COLORS.VERMELHO,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    textAlign: 'center'
  }
});
