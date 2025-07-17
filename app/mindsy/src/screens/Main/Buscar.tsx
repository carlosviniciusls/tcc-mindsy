// @ts-nocheck
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
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { MagnifyingGlass } from 'phosphor-react-native';
import { theme } from '../../theme';

type Livro = {
  id: number;
  titulo: string;
  autor?: string;
  descricao?: string;
  imagem_url?: string;
  tipo: 'pessoal' | 'profissional';
  status: 'disponivel' | 'reservado';
  borderColor?: string;
};

type RootStackParamList = {
  LivroDetalhes: { id: number };
};

const api = axios.create({
  baseURL: 'http://192.168.0.103:3000',
  timeout: 3000
});

export default function Buscar() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  useEffect(() => {
    fetchLivros(true);
  }, [fetchLivros]);

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
      <Card onPress={() => navigation.navigate('LivroDetalhes', { id: item.id })} borderColor={item.borderColor}>
        {item.imagem_url && <Cover source={{ uri: item.imagem_url }} />}
        <Content>
          <Title numberOfLines={1}>{item.titulo}</Title>
          {item.autor && <Author numberOfLines={1}>{item.autor}</Author>}
          {item.descricao && <Desc numberOfLines={5}>{item.descricao}</Desc>}
        </Content>
      </Card>
    ),
    () => true
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.PRETO }} edges={['top', 'bottom']}>
      <Wrapper>
        <SearchWrapper>
          <MagnifyingGlass size={20} color={theme.COLORS.PRETO} />
          <SearchInput
            placeholder="Buscar livro..."
            placeholderTextColor={theme.COLORS.PRETO}
            value={query}
            onChangeText={setQuery}
          />
        </SearchWrapper>

        <FilterRow>
          {(['tudo', 'pessoal', 'profissional'] as const).map((tipo, idx) => (
            <FilterBtn
              key={tipo}
              selected={tipoFilter === tipo}
              onPress={() => {
                setTipoFilter(tipo);
                setQuery('');
              }}
              borderColor={typeColors[idx]}
            >
              <FilterText selected={tipoFilter === tipo} borderColor={typeColors[idx]}>
                {tipo === 'tudo' ? 'Todos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </FilterText>
            </FilterBtn>
          ))}
        </FilterRow>

        {loading && <ActivityIndicator color={theme.COLORS.VERDE} size="large" style={{ marginTop: 16 }} />}
        {error && <Error>{error}</Error>}

        {!loading && !error && (
          <FlatList
            data={livros}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <BookCard item={item} />}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={8}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.COLORS.VERDE} />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={<Empty>{query ? 'Nenhum livro encontrado.' : 'Nenhum livro disponível.'}</Empty>}
          />
        )}
      </Wrapper>
    </SafeAreaView>
  );
}

// Styled Components

const Wrapper = styled.View`
  flex: 1;
  padding: 0 12px;
`;

const SearchWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.COLORS.WHITE};
  border-radius: 24px;
  padding: 8px 16px;
  margin: 16px 0;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 8px;
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.PRETO};
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

const FilterBtn = styled(TouchableOpacity)<{ selected: boolean; borderColor: string }>`
  padding: 6px 12px;
  margin-right: 8px;
  border-radius: 12px;
  border: 3px solid ${({ borderColor }) => borderColor};
  background-color: ${({ selected }) => (selected ? theme.COLORS.PRETO : 'transparent')};
`;

const FilterText = styled.Text<{ selected: boolean; borderColor: string }>`
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${({ selected, borderColor }) => (selected ? borderColor : theme.COLORS.WHITE)};
`;

const Card = styled(TouchableOpacity)<{ borderColor?: string }>`
  flex-direction: row;
  border: 3px solid ${({ borderColor }) => borderColor};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  background-color: transparent;
`;

const Cover = styled.Image`
  width: 100px;
  height: 150px;
  border-radius: 8px;
  background-color: #eee;
`;

const Content = styled.View`
  flex: 1;
  margin-left: 16px;
`;

const Title = styled.Text`
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.XL}px;
  color: ${theme.COLORS.WHITE};
`;

const Author = styled.Text`
  margin-top: 6px;
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
`;

const Desc = styled.Text`
  margin-top: 8px;
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
  line-height: 20px;
`;

const Empty = styled.Text`
  text-align: center;
  margin-top: 32px;
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.WHITE};
`;

const Error = styled.Text`
  text-align: center;
  margin-top: 32px;
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.VERMELHO};
`;
