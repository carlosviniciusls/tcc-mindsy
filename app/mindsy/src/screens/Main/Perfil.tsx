import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Perfil'>;

export default function Perfil({ navigation }: Props) {
  const { usuario } = useAuth();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/avatar.png')}
        style={styles.avatar}
      />

      <Text style={styles.name}>{usuario?.nome || 'Perfil'}</Text>

      <View style={styles.separator} />

      <TouchableOpacity
        style={[styles.option, { borderColor: theme.COLORS.ROXO }]}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.optionText}>Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, { borderColor: theme.COLORS.AMARELO }]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.optionText}>Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO,
    alignItems: 'center',
    paddingTop: 40
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#444',
    marginBottom: 16
  },
  name: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.XL,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    marginBottom: 24
  },
  separator: {
    width: '80%',
    height: 2,
    backgroundColor: theme.COLORS.ROXO,
    marginBottom: 32
  },
  option: {
    width: '90%',
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center'
  },
  optionText: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.MD,
    fontFamily: theme.FONT_FAMILY.BEBASNEUE
  }
});
