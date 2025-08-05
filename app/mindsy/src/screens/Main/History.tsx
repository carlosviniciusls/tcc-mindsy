// src/screens/Main/History.tsx
// @ts-nocheck

import React, {
  useState,
  useCallback,
  useMemo,
  memo
} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';

type Entry = {
  id: number;
  titulo: string;
  autor?: string;
  data_retirada: string;
  maquina: string;
  imagem_url?: string;
  borderColor?: string;
};

export default function History() {
  const { usuario } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const palette = useMemo(
    () => [
      theme.COLORS.BLUE,
      theme.COLORS.VERMELHO,
      theme.COLORS.VERDE,
      theme.COLORS.AMARELO,
      theme.COLORS.ROXO
    ],
    []
  );

  const fetchHistory = useCallback(
    async (withLoading = false) => {
      if (!usuario) return;
      if (withLoading) setLoading(true);
      setError(null);

      try {
        const res = await api.get<Entry[]>(
          `/api/historico/${usuario.id}`
        );
        const dados = res.data.map((item, idx) => ({
          ...item,
          borderColor: palette[idx % palette.length]
        }));
        setEntries(dados);
      } catch {
        setError('Erro ao carregar histórico.');
      } finally {
        if (withLoading) setLoading(false);
      }
    },
    [usuario, palette]
  );

  useFocusEffect(
    useCallback(() => {
      fetchHistory(true);
    }, [fetchHistory])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory(false);
    setRefreshing(false);
  }, [fetchHistory]);

  const EntryCard = memo(
    ({ item }: { item: Entry }) => (
      <View style={[styles.card, { borderColor: item.borderColor }]}>
        {item.imagem_url ? (
          <Image source={{ uri: item.imagem_url }} style={styles.cover} />
        ) : (
          <View style={styles.coverFallback} />
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.titulo}
          </Text>
          {item.autor && (
            <Text style={styles.author} numberOfLines={1}>
              {item.autor}
            </Text>
          )}
          <Text style={styles.meta}>
            Retirado em{' '}
            {new Date(item.data_retirada).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.meta}>{item.maquina}</Text>
        </View>
      </View>
    ),
    () => true
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={styles.header}>HISTÓRICO</Text>

      {loading && (
        <ActivityIndicator
          color={theme.COLORS.VERDE}
          size="large"
          style={styles.loading}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={entries}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <EntryCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.COLORS.VERDE}
            />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma retirada encontrada.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const CARD_HEIGHT = 150;
const COVER_WIDTH = 100;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO,
    paddingHorizontal: 16
  },
  header: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.XL,
    marginVertical: 16,
    textAlign: 'center'
  },
  loading: {
    marginTop: 20
  },
  list: {
    paddingBottom: 24
  },
  card: {
    flexDirection: 'row',
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
    overflow: 'hidden'
  },
  cover: {
    width: COVER_WIDTH,
    height: '100%'
  },
  coverFallback: {
    width: COVER_WIDTH,
    height: '100%',
    backgroundColor: '#333'
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-around'
  },
  title: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.MD
  },
  author: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: theme.FONT_SIZE.SM
  },
  meta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: theme.FONT_SIZE.SM
  },
  error: {
    color: theme.COLORS.VERMELHO,
    textAlign: 'center',
    marginTop: 32
  },
  empty: {
    color: theme.COLORS.WHITE,
    textAlign: 'center',
    marginTop: 32
  }
});
