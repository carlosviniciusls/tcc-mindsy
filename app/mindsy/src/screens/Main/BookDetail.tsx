// src/screens/Main/BookDetail.tsx

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../theme';
import {
  useNavigation,
  useRoute,
  RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeftIcon, StarIcon } from 'phosphor-react-native';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import type { BuscarStackParamList } from '../../navigation/BuscarStack';
import type { Livro } from './Buscar';

type RouteProps = RouteProp<BuscarStackParamList, 'LivroDetalhes'>;
type NavProps   = NativeStackNavigationProp<BuscarStackParamList, 'LivroDetalhes'>;

export type Machine = {
  id: number;
  nome: string;
  localizacao: string;
};

export default function LivroDetalhes() {
  const navigation       = useNavigation<NavProps>();
  const { book }: { book: Livro } = useRoute<RouteProps>().params;
  const { usuario }      = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [machines, setMachines]             = useState<Machine[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);

  const isFav = favorites.some((f: Livro) => f.id === book.id);

  useEffect(() => {
    if (book.status === 'disponivel') {
      setLoadingMachines(true);
      api
        .get<Machine[]>(`/api/maquinas/livro/${book.id}`)
        .then(res => setMachines(res.data))
        .catch(() => {})
        .finally(() => setLoadingMachines(false));
    }
  }, [book.id, book.status]);

  const handleReserve = (machineId: number) => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para reservar.');
      return;
    }

    Alert.alert(
      'Confirmar reserva',
      'Deseja realmente reservar este livro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.post('/api/reservas', {
                usuario_id: usuario.id,
                livro_id: book.id
              });
              Alert.alert(
                'Sucesso',
                'Você reservou um livro. Verifique a tela inicial para retirar seu livro quando estiver no local.'
              );
              navigation.goBack();
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível registrar sua reserva. Tente novamente.'
              );
            }
          }
        }
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para favoritar.');
      return;
    }

    try {
      if (isFav) {
        await api.delete('/api/favoritos', {
          data: {
            usuario_id: usuario.id,
            livro_id: book.id
          }
        });
        removeFavorite(book.id);
      } else {
        await api.post('/api/favoritos', {
          usuario_id: usuario.id,
          livro_id: book.id
        });
        addFavorite(book);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar favoritos.');
    }
  };

  return (
    <Container>
      <TopBar>
        <Back onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color={theme.COLORS.WHITE} />
        </Back>
      </TopBar>

      <Content>
        <CoverWrapper>
          <Cover source={{ uri: book.imagem_url || '' }} resizeMode="cover" />
        </CoverWrapper>

        <FavIconWrapper>
          <FavButton onPress={handleToggleFavorite}>
            <StarIcon
              size={28}
              weight={isFav ? 'fill' : 'regular'}
              color={theme.COLORS.AMARELO}
            />
          </FavButton>
        </FavIconWrapper>

        <Header>
          <Title numberOfLines={2}>{book.titulo}</Title>
          {book.autor && <Author numberOfLines={1}>por {book.autor}</Author>}
        </Header>

        <Section>
          <SectionLabel>DESCRIÇÃO</SectionLabel>
          <SectionText>
            {book.descricao ?? 'Sem descrição disponível.'}
          </SectionText>
        </Section>

        <Section>
          <SectionLabel>STATUS</SectionLabel>
          <InfoValue available={book.status === 'disponivel'}>
            {book.status === 'disponivel' ? 'Disponível' : 'Reservado'}
          </InfoValue>
        </Section>

        {book.status === 'disponivel' && (
          <Section>
            <SectionLabel>DISPONÍVEL EM</SectionLabel>
            {loadingMachines ? (
              <ActivityIndicator
                color={theme.COLORS.VERDE}
                size="small"
              />
            ) : machines.length > 0 ? (
              machines.map(m => (
                <MachineItem key={m.id}>
                  <MachineInfo>
                    <MachineName numberOfLines={1}>{m.nome}</MachineName>
                    <MachineLocation numberOfLines={1}>
                      {m.localizacao}
                    </MachineLocation>
                  </MachineInfo>
                  <ReserveBtn onPress={() => handleReserve(m.id)}>
                    <ReserveTxt>Reservar</ReserveTxt>
                  </ReserveBtn>
                </MachineItem>
              ))
            ) : (
              <SectionText>Nenhuma máquina disponível.</SectionText>
            )}
          </Section>
        )}
      </Content>
    </Container>
  );
}

// Styled components

const Container = styled.View`
  flex: 1;
  background-color: ${theme.COLORS.PRETO};
`;

const TopBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px 0;
`;

const Back = styled.Pressable`
  padding: 8px;
`;

const FavIconWrapper = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const FavButton = styled.Pressable`
  padding: 4px;
`;

const Content = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 24 }
})`
  flex: 1;
`;

const CoverWrapper = styled.View.attrs({
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 6
})`
  width: 200px;
  height: 300px;
  align-self: center;
  border-radius: 6px;
  overflow: hidden;
  background-color: ${theme.COLORS.WHITE};
  margin-bottom: 16px;
`;

const Cover = styled.Image`
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  margin-bottom: 24px;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.XL * 1.5}px;
  color: ${theme.COLORS.WHITE};
  text-align: center;
  margin-bottom: 8px;
`;

const Author = styled.Text`
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.LG}px;
  color: ${theme.COLORS.WHITE};
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionLabel = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.WHITE};
  margin-bottom: 8px;
`;

const SectionText = styled.Text`
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.LG}px;
  color: ${theme.COLORS.WHITE};
  line-height: 24px;
`;

interface InfoValueProps {
  available: boolean;
}

const InfoValue = styled.Text<InfoValueProps>`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.LG}px;
  color: ${({ available }: InfoValueProps) =>
    available ? theme.COLORS.VERDE : theme.COLORS.VERMELHO};
`;

const MachineItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.COLORS.WHITE};
`;

const MachineInfo = styled.View`
  flex: 1;
  margin-right: 12px;
`;

const MachineName = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.WHITE};
`;

const MachineLocation = styled.Text`
  font-family: ${theme.FONT_FAMILY.INST_SANS};
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.WHITE};
`;

const ReserveBtn = styled.Pressable`
  background-color: ${theme.COLORS.AMARELO};
  padding: 8px 16px;
  border-radius: 6px;
`;

const ReserveTxt = styled.Text`
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
  font-size: ${theme.FONT_SIZE.SM}px;
  color: ${theme.COLORS.PRETO};
`;
