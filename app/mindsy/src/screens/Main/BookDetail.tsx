// src/screens/Main/BookDetail.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native'
import {
  useNavigation,
  useRoute,
  RouteProp
} from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeftIcon, StarIcon } from 'phosphor-react-native'

import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useFavorites } from '../../contexts/FavoriteContext'
import { theme } from '../../theme'
import type { BuscarStackParamList } from '../../navigation/BuscarStack'
import type { Livro } from './Buscar'

type RouteProps = RouteProp<BuscarStackParamList, 'LivroDetalhes'>
type NavProps   = NativeStackNavigationProp<BuscarStackParamList, 'LivroDetalhes'>

export type Machine = {
  id: number
  nome: string
  localizacao: string
}

export default function LivroDetalhes() {
  const navigation       = useNavigation<NavProps>()
  const { book }: { book: Livro } = useRoute<RouteProps>().params
  const { usuario }      = useAuth()
  const { favorites, addFavorite, removeFavorite } = useFavorites()

  const [machines, setMachines]               = useState<Machine[]>([])
  const [loadingMachines, setLoadingMachines] = useState(false)
  const [isReserving, setIsReserving]         = useState(false)
  const isFav = favorites.some(f => f.id === book.id)

  useEffect(() => {
    if (book.status === 'disponivel') {
      setLoadingMachines(true)
      api.get<Machine[]>(`/api/maquinas/livro/${book.id}`)
        .then(res => setMachines(res.data))
        .catch(() => {
          Alert.alert('Erro', 'Falha ao carregar máquinas disponíveis.')
        })
        .finally(() => setLoadingMachines(false))
    }
  }, [book.id, book.status])

  const handleReserve = (machineId: number) => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para reservar.')
      return
    }

    if (isReserving) return // evita envios múltiplos

    Alert.alert(
      'Confirmar reserva',
      'Deseja realmente reservar este livro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setIsReserving(true)
            try {
              const payload = {
                usuario_id: usuario.id,
                livro_id: book.id,
                maquina_id: machineId // inclua se o backend aceitar
              }

              const res = await api.post('/api/reservas', payload)

              const successMessage = res?.data?.message ?? 'Reserva realizada com sucesso.'
              Alert.alert('Sucesso', successMessage)
              navigation.goBack()
            } catch (err: any) {
              const serverMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Não foi possível registrar sua reserva. Tente novamente.'
              Alert.alert('Erro', serverMessage)
              console.warn('Reserva error:', err?.response ?? err)
            } finally {
              setIsReserving(false)
            }
          }
        }
      ]
    )
  }

  const handleToggleFavorite = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para favoritar.')
      return
    }

    try {
      if (isFav) {
        await api.delete('/api/favoritos', {
          data: { usuario_id: usuario.id, livro_id: book.id }
        })
        removeFavorite(book.id)
      } else {
        await api.post('/api/favoritos', {
          usuario_id: usuario.id,
          livro_id: book.id
        })
        addFavorite(book)
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar favoritos.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color={theme.COLORS.WHITE} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: book.imagem_url ?? '' }}
            style={styles.cover}
            resizeMode="cover"
          />
        </View>

        <View style={styles.favIconWrapper}>
          <Pressable style={styles.favButton} onPress={handleToggleFavorite}>
            <StarIcon
              size={28}
              weight={isFav ? 'fill' : 'regular'}
              color={theme.COLORS.AMARELO}
            />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {book.titulo}
          </Text>
          {book.autor && (
            <Text style={styles.author} numberOfLines={1}>
              por {book.autor}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={styles.sectionText}>
            {book.descricao ?? 'Sem descrição disponível.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STATUS</Text>
          <Text
            style={[
              styles.infoValue,
              book.status === 'disponivel' ? styles.available : styles.unavailable
            ]}
          >
            {book.status === 'disponivel' ? 'Disponível' : 'Reservado'}
          </Text>
        </View>

        {book.status === 'disponivel' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DISPONÍVEL EM</Text>
            {loadingMachines ? (
              <ActivityIndicator color={theme.COLORS.VERDE} size="small" />
            ) : machines.length > 0 ? (
              machines.map(m => (
                <View style={styles.machineItem} key={m.id}>
                  <View style={styles.machineInfo}>
                    <Text style={styles.machineName} numberOfLines={1}>
                      {m.nome}
                    </Text>
                    <Text style={styles.machineLocation} numberOfLines={1}>
                      {m.localizacao}
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.reserveBtn,
                      isReserving ? { opacity: 0.6 } : undefined
                    ]}
                    onPress={() => handleReserve(m.id)}
                    disabled={isReserving}
                  >
                    <Text style={styles.reserveTxt}>
                      {isReserving ? 'Reservando...' : 'Reservar'}
                    </Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.sectionText}>Nenhuma máquina disponível.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRETO
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24
  },
  back: {
    padding: 8
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 24
  },
  coverWrapper: {
    width: 200,
    height: 300,
    alignSelf: 'center',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.WHITE,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6
  },
  cover: {
    width: '100%',
    height: '100%'
  },
  favIconWrapper: {
    alignItems: 'center',
    marginBottom: 16
  },
  favButton: {
    padding: 4
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.XL * 1.5,
    color: theme.COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 8
  },
  author: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.LG,
    color: theme.COLORS.WHITE
  },
  section: {
    marginBottom: 24
  },
  sectionLabel: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.WHITE,
    marginBottom: 8
  },
  sectionText: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.LG,
    color: theme.COLORS.WHITE,
    lineHeight: 24
  },
  infoValue: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.LG
  },
  available: {
    color: theme.COLORS.VERDE
  },
  unavailable: {
    color: theme.COLORS.VERMELHO
  },
  machineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.WHITE
  },
  machineInfo: {
    flex: 1,
    marginRight: 12
  },
  machineName: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.MD,
    color: theme.COLORS.WHITE
  },
  machineLocation: {
    fontFamily: theme.FONT_FAMILY.INST_SANS,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.WHITE
  },
  reserveBtn: {
    backgroundColor: theme.COLORS.AMARELO,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },
  reserveTxt: {
    fontFamily: theme.FONT_FAMILY.BEBASNEUE,
    fontSize: theme.FONT_SIZE.SM,
    color: theme.COLORS.PRETO
  }
})
