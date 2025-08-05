// src/screens/Main/Favoritos.tsx
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
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StarIcon } from 'phosphor-react-native';

import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';
import type { Livro } from './Buscar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FavoritosStackParamList } from '../../navigation/FavoritosStack';

export type Favorito = Livro & {
  data_favorito?: string;
  borderColor?: string;
};

export default function Favoritos() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FavoritosStackParamList>>();
  const { usuario } = useAuth();

  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
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

  const fetchFavoritos = useCallback(
    async (withLoading = false) => {
      if (!usuario) return;
      if (withLoading) setLoading(true);
      setError(null);

      try {
        const res = await api.get<Favorito[]>(`/api/favoritos/${usuario.id}`);
        const dados = res.data.map((raw, idx) => ({
          ...raw,
          borderColor: palette[idx % palette.length]
        }));
        setFavoritos(dados);
      } catch {
        setError('Não foi possível carregar seus favoritos.');
      } finally {
        if (withLoading) setLoading(false);
      }
    },
    [usuario, palette]
  );

  useFocusEffect(
    useCallback(() => {
      fetchFavoritos(true);
    }, [fetchFavoritos])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavoritos(false);
    setRefreshing(false);
  }, [fetchFavoritos]);

  const handleOpenDetails = (livro: Livro) => {
    navigation.navigate('LivroDetalhes', { book: livro });
  };

  const FavoritoCard = memo(
    ({ item }: { item: Favorito }) => (
      <TouchableOpacity
        style={[
          styles.card,
          { borderColor: item.borderColor || theme.COLORS.AMARELO }
        ]}
        onPress={() => handleOpenDetails(item)}
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
            <Text style={styles.desc} numberOfLines={3}>
              {item.descricao}
            </Text>
          )}
          {item.data_favorito &&
            !isNaN(Date.parse(item.data_favorito)) && (
              <Text style={styles.dateText}>
                Favoritado em{' '}
                {new Date(item.data_favorito).toLocaleDateString('pt-BR')}
              </Text>
            )}
        </View>
      </TouchableOpacity>
    ),
    () => true
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <StarIcon size={64} weight="duotone" color={theme.COLORS.AMARELO} />
      <Text style={styles.emptyText}>
        Você ainda não adicionou livros aos seus favoritos.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.wrapper}>
        <Text style={styles.header}>Seus favoritos:</Text>

        {loading && (
          <ActivityIndicator
            color={theme.COLORS.VERDE}
            size="large"
            style={styles.loading}
          />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && (
          <FlatList
            data={favoritos}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <FavoritoCard item={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.COLORS.VERDE}
              />
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyState />}
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
    flex: 1
  },
  header: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: 40,
    color: theme.COLORS.WHITE,
    marginVertical: 8,
    marginHorizontal: 18,
    marginTop: 25
  },
  loading: {
    marginTop: 16
  },
  card: {
    flexDirection: 'row',
    borderWidth: 3,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    backgroundColor: '#eee'
  },
  content: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.LG,
    color: theme.COLORS.WHITE
  },
  author: {
    marginTop: 4,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE
  },
  desc: {
    marginTop: 6,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE,
    lineHeight: 18
  },
  dateText: {
    marginTop: 8,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.WHITE
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    color: theme.COLORS.VERMELHO
  },
  listContent: {
    padding: 16
  }
});
