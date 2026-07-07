// ============================================================
// Tela Home (Dashboard) — Arena Play Quadras
// Saudação, busca, catálogo de serviços (carousel) e campeonatos.
// ============================================================

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs, SCREEN_WIDTH, effectiveWidth } from '../theme/responsive';
import { sportAPI, tournamentAPI, userAPI } from '../services/api';

const CARD_WIDTH = effectiveWidth * 0.82;
const CARD_SPACING = s(10);

// Serviços do catálogo (carousel horizontal)
const servicos = [
  {
    id: '1',
    icon: 'volleyball-ball',
    titulo: 'Reservar Quadra',
    descricao: 'Escolha o esporte, dia e horário e garanta sua quadra em segundos.',
    tela: 'Agendamento',
    cor: '#148866',
    corClara: '#E8F5F0',
    corMedia: '#A8D8C8',
    destaque: 'Mais popular',
  },
  {
    id: '2',
    icon: 'search-location',
    titulo: 'Buscar Quadras',
    descricao: 'Encontre quadras disponíveis por esporte, proximidade ou preço.',
    tela: 'Busca',
    cor: '#4CB8D4',
    corClara: '#E6F6FB',
    corMedia: '#A3DAE8',
    destaque: null,
  },
  {
    id: '3',
    icon: 'table-tennis',
    titulo: 'Equipamentos',
    descricao: 'Alugue raquetes, bolas e acessórios na hora da reserva.',
    tela: 'Equipamentos',
    cor: '#E67E22',
    corClara: '#FFF3E0',
    corMedia: '#F5C99D',
    destaque: 'Em breve',
    desabilitado: true,
  },
  {
    id: '4',
    icon: 'trophy',
    titulo: 'Campeonatos',
    descricao: 'Inscreva-se em torneios oficiais e dispute prêmios incríveis.',
    tela: 'Campeonatos',
    cor: '#8E44AD',
    corClara: '#F3E8F9',
    corMedia: '#CDA4E0',
    destaque: 'Novidade',
  },
  {
    id: '5',
    icon: 'calendar-check',
    titulo: 'Minha Agenda',
    descricao: 'Acompanhe todas as suas reservas e compromissos esportivos.',
    tela: 'Início',
    tabName: 'Agenda',
    cor: '#2980B9',
    corClara: '#E8F0FE',
    corMedia: '#A4C8E8',
    destaque: null,
  },
  {
    id: '6',
    icon: 'video',
    titulo: 'Meus Vídeos',
    descricao: 'Reveja os melhores momentos gravados durante suas partidas.',
    tela: 'Início',
    tabName: 'Meus Vídeos',
    cor: '#C0392B',
    corClara: '#FDECEC',
    corMedia: '#E8A9A3',
    destaque: null,
  },
];

export default function HomeScreen({ route, navigation }) {
  // Refs SEMPRE primeiro (antes de qualquer condicional)
  const flatListRef = useRef(null);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Estados
  const [activeIndex, setActiveIndex] = useState(0);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  // Pega o usuário que fez o login globalmente
  const usuarioLogado = global.usuarioLogado || { nome: 'Visitante', id: '0' };
  const [mockUser, setMockUser] = useState(usuarioLogado);
  const [loading, setLoading] = useState(true);

  // Busca dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Removemos a busca de usuários daqui, pois agora a Home recebe os dados do Login
        const [sportsData, tournamentsData] = await Promise.all([
          sportAPI.getAll(),
          tournamentAPI.getAll(),
        ]);
        setSports(sportsData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Falha ao carregar os dados. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Navega para o serviço selecionado
  const handleServicoPress = (servico) => {
    if (servico.desabilitado) return;
    if (servico.tabName) {
      // Navega para a aba dentro do TabNavigator
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('Início', { screen: servico.tabName });
      } else {
        navigation.navigate(servico.tabName);
      }
    } else {
      navigation.navigate(servico.tela);
    }
  };

  // ---- Card do carousel de serviço ----
  const renderServicoCard = ({ item }) => (
    <View style={[styles.servicoCard, { width: CARD_WIDTH }, item.desabilitado && { opacity: 0.5 }]}>
      {/* Área visual superior — toque leva à tela */}
      <TouchableOpacity
        style={[styles.servicoIconeArea, { backgroundColor: item.desabilitado ? Colors.textLight : item.cor }]}
        onPress={() => handleServicoPress(item)}
        activeOpacity={item.desabilitado ? 1 : 0.9}
        disabled={item.desabilitado}
      >
        {/* Círculos decorativos */}
        <View style={[styles.servicoCircleLg, { backgroundColor: item.corMedia + '55' }]} />
        <View style={[styles.servicoCircleSm, { backgroundColor: item.corMedia + '40' }]} />
        {/* Ícone principal */}
        <View style={styles.servicoIconeWrap}>
          <FontAwesome5 name={item.icon} size={s(28)} color={Colors.white} />
        </View>
        {/* Badge de destaque */}
        {item.destaque && (
          <View style={styles.servicoDestaque}>
            <Text style={styles.servicoDestaqueTexto}>{item.destaque}</Text>
          </View>
        )}
      </TouchableOpacity>
      {/* Conteúdo inferior */}
      <View style={styles.servicoInfo}>
        <Text style={styles.servicoTitulo}>{item.titulo}</Text>
        <Text style={styles.servicoDescricao}>{item.descricao}</Text>
        <View style={styles.servicoFooter}>
          <TouchableOpacity
            style={[styles.servicoBotao, { backgroundColor: item.desabilitado ? Colors.textLight : item.cor }]}
            onPress={() => handleServicoPress(item)}
            activeOpacity={item.desabilitado ? 1 : 0.8}
            disabled={item.desabilitado}
          >
            <Text style={styles.servicoBotaoTexto}>Acessar</Text>
            <FontAwesome5 name="arrow-right" size={fs(10)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ---- Card de campeonato ----
  const renderTournamentCard = ({ item }) => {
    const vagasRestantes = item.vagas - item.vagasPreenchidas;
    const esgotado = vagasRestantes <= 0;

    return (
      <TouchableOpacity
        style={styles.tournamentCard}
        onPress={() => navigation.navigate('Campeonatos')}
        activeOpacity={0.7}
      >
        <View style={styles.tournamentBadge}>
          <Text style={styles.tournamentBadgeText}>{item.esporte}</Text>
        </View>
        <Text style={styles.tournamentNome}>{item.nome}</Text>
        <View style={styles.tournamentRow}>
          <FontAwesome5 name="calendar-alt" size={12} color={Colors.textMedium} />
          <Text style={styles.tournamentDetalhe}>{item.data} às {item.horario}</Text>
        </View>
        <View style={styles.tournamentRow}>
          <FontAwesome5 name="trophy" size={12} color={Colors.warning} />
          <Text style={styles.tournamentDetalhe}>{item.premiacao}</Text>
        </View>
        <View style={styles.tournamentFooter}>
          <Text style={[styles.tournamentVagas, esgotado && styles.esgotado]}>
            {esgotado ? 'ESGOTADO' : `${vagasRestantes} vagas restantes`}
          </Text>
          <Text style={styles.tournamentTaxa}>
            R$ {item.taxaInscricao.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---- Cabeçalho com saudação ---- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, {mockUser.nome}! 👋</Text>
          <Text style={styles.subtitulo}>Pronto para jogar na areia?</Text>
        </View>
      </View>

      {/* ---- Barra de Busca ---- */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Busca')}
        activeOpacity={0.8}
      >
        <Text style={styles.searchIcone}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Buscar quadras, esportes...</Text>
      </TouchableOpacity>

      {/* ---- Catálogo de Serviços (Carousel Horizontal) ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nossos Serviços</Text>
        <Text style={styles.sectionSubtitle}>
          Deslize para explorar tudo que oferecemos
        </Text>

        <FlatList
          ref={flatListRef}
          data={servicos}
          renderItem={renderServicoCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        {/* Indicadores (dots) */}
        <View style={styles.dotsRow}>
          {servicos.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* ---- Quadras em Destaque (scroll horizontal compacto) ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quadras em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Busca')}>
            <Text style={styles.verTodos}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>Reserve agora mesmo</Text>

        <FlatList
          data={sports}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quadrasLista}
          renderItem={({ item: sport }) => (
            <TouchableOpacity
              style={styles.quadraCard}
              onPress={() => navigation.navigate('Agendamento', { esporte: sport })}
              activeOpacity={0.85}
            >
              <View style={[styles.quadraImgArea, { backgroundColor: sport.cor }]}>
                <Image
                  source={require('../../assets/splash-icon.png')}
                  style={styles.quadraDecor}
                  resizeMode="contain"
                />
                <Text style={styles.quadraEmoji}>{sport.emoji}</Text>
                <View style={styles.quadraTag}>
                  <Text style={styles.quadraTagText}>{sport.tag}</Text>
                </View>
              </View>
              <View style={styles.quadraInfo}>
                <Text style={styles.quadraNome}>{sport.nome}</Text>
                <Text style={styles.quadraPreco}>
                  R$ {sport.precoPorHora}<Text style={styles.quadraPrecoPor}>/h</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ---- Seção de Próximos Campeonatos ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Campeonatos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Campeonatos')}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>
          Inscreva-se e mostre seu talento!
        </Text>

        <FlatList
          data={tournaments.slice(0, 3)}
          renderItem={renderTournamentCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tournamentList}
        />
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ---- Estilos da tela Home ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(50),
    paddingBottom: s(22),
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: s(20),
    borderBottomRightRadius: s(20),
  },
  saudacao: {
    fontSize: fs(20),
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitulo: {
    fontSize: fs(12),
    color: Colors.white + 'CC',
    marginTop: s(3),
  },

  // Barra de busca
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: s(20),
    marginTop: s(-18),
    borderRadius: s(14),
    paddingHorizontal: s(14),
    paddingVertical: s(11),
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  searchIcone: {
    fontSize: fs(16),
    marginRight: s(10),
  },
  searchPlaceholder: {
    fontSize: fs(13),
    color: Colors.textLight,
    flex: 1,
  },

  // Seções
  section: {
    marginTop: s(22),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  sectionTitle: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.textDark,
    paddingHorizontal: s(20),
  },
  sectionSubtitle: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginTop: s(3),
    marginBottom: s(12),
    paddingHorizontal: s(20),
  },
  verTodos: {
    fontSize: fs(12),
    color: Colors.primary,
    fontWeight: '600',
  },

  // Carousel de serviços
  carouselContainer: {
    paddingLeft: s(20),
    paddingRight: s(20) - CARD_SPACING,
  },
  servicoCard: {
    backgroundColor: Colors.white,
    borderRadius: s(18),
    marginRight: CARD_SPACING,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  servicoIconeArea: {
    height: s(130),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  servicoIconeWrap: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  servicoCircleLg: {
    position: 'absolute',
    width: s(140),
    height: s(140),
    borderRadius: s(70),
    top: s(-30),
    right: s(-30),
  },
  servicoCircleSm: {
    position: 'absolute',
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    bottom: s(-20),
    left: s(-15),
  },
  servicoDestaque: {
    position: 'absolute',
    top: s(10),
    right: s(10),
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(20),
    zIndex: 3,
  },
  servicoDestaqueTexto: {
    fontSize: fs(9),
    fontWeight: '800',
    color: Colors.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  servicoInfo: {
    padding: s(16),
  },
  servicoTitulo: {
    fontSize: fs(16),
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: s(5),
  },
  servicoDescricao: {
    fontSize: fs(11),
    color: Colors.textMedium,
    lineHeight: fs(17),
    marginBottom: s(14),
  },
  servicoFooter: {
    flexDirection: 'row',
  },
  servicoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(16),
    paddingVertical: s(9),
    borderRadius: s(12),
  },
  servicoBotaoTexto: {
    color: Colors.white,
    fontSize: fs(12),
    fontWeight: '700',
  },

  // Dots (indicadores)
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(12),
  },
  dot: {
    width: s(7),
    height: s(7),
    borderRadius: s(4),
    backgroundColor: Colors.textLight + '40',
    marginHorizontal: s(3),
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: s(20),
    borderRadius: s(4),
  },

  // Quadras em Destaque
  quadrasLista: {
    paddingLeft: s(20),
    paddingRight: s(8),
  },
  quadraCard: {
    width: s(160),
    backgroundColor: Colors.white,
    borderRadius: s(14),
    marginRight: s(12),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  quadraImgArea: {
    height: s(90),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  quadraDecor: {
    position: 'absolute',
    width: s(64),
    height: s(64),
    opacity: 0.15,
  },
  quadraEmoji: {
    fontSize: s(36),
  },
  quadraTag: {
    position: 'absolute',
    top: s(6),
    right: s(6),
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: s(6),
    paddingVertical: s(2),
    borderRadius: s(8),
  },
  quadraTagText: {
    fontSize: fs(9),
    fontWeight: '700',
    color: Colors.textDark,
  },
  quadraInfo: {
    padding: s(10),
  },
  quadraNome: {
    fontSize: fs(12),
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: s(3),
  },
  quadraPreco: {
    fontSize: fs(13),
    fontWeight: '700',
    color: Colors.primary,
  },
  quadraPrecoPor: {
    fontSize: fs(10),
    fontWeight: '400',
    color: Colors.textMedium,
  },

  // Cards de Campeonatos (scroll horizontal)
  tournamentList: {
    paddingLeft: s(20),
    paddingRight: s(8),
  },
  tournamentCard: {
    width: s(220),
    backgroundColor: Colors.white,
    borderRadius: s(14),
    padding: s(14),
    marginRight: s(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tournamentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: s(8),
    paddingVertical: s(3),
    borderRadius: s(6),
    marginBottom: s(6),
  },
  tournamentBadgeText: {
    fontSize: fs(10),
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  tournamentNome: {
    fontSize: fs(13),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(8),
  },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(4),
  },
  tournamentDetalhe: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginLeft: s(6),
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(10),
    paddingTop: s(8),
    borderTopWidth: 1,
    borderTopColor: Colors.card,
  },
  tournamentVagas: {
    fontSize: fs(10),
    fontWeight: '600',
    color: Colors.success,
  },
  esgotado: {
    color: Colors.danger,
  },
  tournamentTaxa: {
    fontSize: fs(12),
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
