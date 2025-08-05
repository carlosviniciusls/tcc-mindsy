// src/screens/Main/Buscar.tsx
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo
} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Text,
  TextInput,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MagnifyingGlass } from 'phosphor-react-native';

import { api } from '../../services/api';
import { theme } from '../../theme';

export type Livro = {
  id: number;
  titulo: string;
  autor?: string;
  descricao?: string;
  imagem_url?: string;
  tipo: 'pessoal' | 'profissional';
  status: 'disponivel' | 'reservado';
  borderColor?: string;
};

export default function Buscar() {
  const navigation = useNavigation<any>();

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

  const typeColors = useMemo(
    () => [palette[1], palette[2], palette[4]],
    [palette]
  );

  const [query, setQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'tudo' | 'pessoal' | 'profissional'>('tudo');
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLivros = useCallback(
    async (fetchLoading = false) => {
      if (fetchLoading) setLoading(true);
      setError(null);

      let url = '/api/livros';
      let params: any;

      if (query.trim()) {
        url = '/api/livros/buscar';
        params = { titulo: query.trim() };
      } else if (tipoFilter !== 'tudo') {
        url = `/api/livros/filtro/tipo/${tipoFilter}`;
      }

      try {
        const res = await api.get<Livro[]>(url, { params });
        const dados = res.data.map((item, idx) => ({
          ...item,
          borderColor: palette[idx % palette.length]
        }));
        setLivros(dados);
      } catch {
        setError('Erro ao carregar livros.');
      } finally {
        if (fetchLoading) setLoading(false);
      }
    },
    [query, tipoFilter, palette]
  );

  useFocusEffect(
    useCallback(() => {
      fetchLivros(true);
    }, [fetchLivros])
  );

  useEffect(() => {
    const t = setTimeout(() => fetchLivros(false), 300);
    return () => clearTimeout(t);
  }, [query, tipoFilter, fetchLivros]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLivros(true);
    setRefreshing(false);
  }, [fetchLivros]);

  const BookCard = memo(
    ({ item }: { item: Livro }) => (
      <TouchableOpacity
        style={[styles.card, { borderColor: item.borderColor }]}
        onPress={() => navigation.navigate('LivroDetalhes', { book: item })}
      >
        {item.imagem_url && (
          <Image source={{ uri: item.imagem_url }} style={styles.cover} />
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.titulo}
          </Text>
          {item.autor && (
            <Text style={styles.author} numberOfLines={1}>
              {item.autor}
            </Text>
          )}
          {item.descricao && (
            <Text style={styles.desc} numberOfLines={5}>
              {item.descricao}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    () => true
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.wrapper}>
        <View style={styles.searchWrapper}>
          <MagnifyingGlass size={20} color={theme.COLORS.PRETO} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar livro..."
            placeholderTextColor={theme.COLORS.PRETO}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.filterRow}>
          {(['tudo', 'pessoal', 'profissional'] as const).map((tipo, idx) => {
            const selected = tipoFilter === tipo;
            const borderColor = typeColors[idx];
            return (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.filterBtn,
                  {
                    borderColor,
                    backgroundColor: selected ? theme.COLORS.PRETO : 'transparent'
                  }
                ]}
                onPress={() => {
                  setTipoFilter(tipo);
                  setQuery('');
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: selected ? borderColor : theme.COLORS.WHITE }
                  ]}
                >
                  {tipo === 'tudo' ? 'Todos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

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
            data={livros}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <BookCard item={item} />}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={8}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.COLORS.VERDE}
              />
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {query ? 'Nenhum livro encontrado.' : 'Nenhum livro disponível.'}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 12
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 16
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.PRETO
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 3
  },
  filterText: {
    fontSize: theme.FONT_SIZE.SM
  },
  card: {
    flexDirection: 'row',
    borderWidth: 3,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    backgroundColor: 'transparent'
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#eee'
  },
  content: {
    flex: 1,
    marginLeft: 16
  },
  title: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.XL,
    color: theme.COLORS.WHITE
  },
  author: {
    marginTop: 6,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE
  },
  desc: {
    marginTop: 8,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE,
    lineHeight: 20
  },
  loading: {
    marginTop: 16
  },
  listContent: {
    paddingBottom: 24
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.WHITE
  },
  error: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.VERMELHO
  }
});
