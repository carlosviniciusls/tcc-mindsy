// src/screens/Main/Favoritos.tsx

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo
} from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';
import { StarIcon } from 'phosphor-react-native';
import type { Livro } from './Buscar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FavoritosStackParamList } from '../../navigation/FavoritosStack';

type Favorito = Livro & {
  data_favorito?: string;
  borderColor?: string;
};

const api = axios.create({
  baseURL: 'http://192.168.0.105:3000',
  timeout: 3000
});

export default function Favoritos() {
  const navigation = useNavigation<NativeStackNavigationProp<FavoritosStackParamList>>();
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

  useEffect(() => {
    fetchFavoritos(true);
  }, [fetchFavoritos]);

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
      <Card borderColor={item.borderColor} onPress={() => handleOpenDetails(item)}>
        {item.imagem_url && (
          <Cover source={{ uri: item.imagem_url }} />
        )}
        <Content>
          <Title numberOfLines={1}>{item.titulo}</Title>
          {item.autor && <Author numberOfLines={1}>{item.autor}</Author>}
          {item.descricao && (
            <Desc numberOfLines={3}>{item.descricao}</Desc>
          )}
          {item.data_favorito && !isNaN(Date.parse(item.data_favorito)) && (
            <DateText>
              Favoritado em {new Date(item.data_favorito).toLocaleDateString('pt-BR')}
            </DateText>
          )}
        </Content>
      </Card>
    ),
    () => true
  );

  const EmptyState = () => (
    <EmptyContainer>
      <StarIcon size={64} weight="duotone" color={theme.COLORS.AMARELO} />
      <EmptyText>
        Você ainda não adicionou livros aos seus favoritos.
      </EmptyText>
    </EmptyContainer>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.COLORS.PRETO }}
      edges={['top', 'bottom']}
    >
      <Wrapper>
        <SeusFavoritos>Seus favoritos:</SeusFavoritos>

        {loading && (
          <ActivityIndicator
            color={theme.COLORS.VERDE}
            size="large"
            style={{ marginTop: 16 }}
          />
        )}

        {error && <ErrorText>{error}</ErrorText>}

        {!loading && !error && (
          <FlatList
            data={favoritos}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <FavoritoCard item={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.COLORS.VERDE}
              />
            }
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<EmptyState />}
          />
        )}
      </Wrapper>
    </SafeAreaView>
  );
}

// Styled Components

const Wrapper = styled.View` flex: 1; `;

const SeusFavoritos = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: 40px;
  color: ${theme.COLORS.WHITE};
  margin: 40px 18px 8px;
`;

interface CardProps {
  borderColor?: string;
}

const Card = styled.TouchableOpacity<CardProps>`
  flex-direction: row;
  border: 3px solid ${({ borderColor }: CardProps) => borderColor || theme.COLORS.AMARELO};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Cover = styled.Image`
  width: 80px;
  height: 120px;
  border-radius: 6px;
  background-color: #eee;
`;

const Content = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const Title = styled.Text`
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.LG}px;
  color: ${theme.COLORS.WHITE};
`;

const Author = styled.Text`
  margin-top: 4px;
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
`;

const Desc = styled.Text`
  margin-top: 6px;
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
  line-height: 18px;
`;

const DateText = styled.Text`
  margin-top: 8px;
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
`;

const EmptyText = styled.Text`
  margin-top: 16px;
  text-align: center;
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.WHITE};
`;

const ErrorText = styled.Text`
  text-align: center;
  margin-top: 32px;
  color: ${theme.COLORS.VERMELHO};
`;
