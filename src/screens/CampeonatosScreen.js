// ============================================================
// Tela de Campeonatos — Arena Play Quadras
// Lista todos os torneios abertos para inscrição.
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { tournamentAPI } from '../services/api';

export default function CampeonatosScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca dados da API
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await tournamentAPI.getAll();
        setTournaments(data);
      } catch (error) {
        console.error('Erro ao carregar torneios:', error);
        Alert.alert('Erro', 'Falha ao carregar os torneios. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Inscrição simulada
  const handleInscrever = (torneio) => {
    const vagasRestantes = torneio.vagas - torneio.vagasPreenchidas;
    if (vagasRestantes <= 0) {
      Alert.alert(
        'Vagas Esgotadas',
        'Este torneio está com todas as vagas preenchidas. Deseja entrar na lista de espera?',
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim, entrar na fila', onPress: () => Alert.alert('Pronto!', 'Você foi adicionado à lista de espera.') },
        ]
      );
    } else {
      Alert.alert(
        'Confirmar Inscrição',
        `Deseja se inscrever no "${torneio.nome}"?\n\nTaxa: R$ ${torneio.taxaInscricao.toFixed(2)}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Inscrever-se', onPress: () => Alert.alert('✅ Inscrição Confirmada!', 'Boa sorte no campeonato!') },
        ]
      );
    }
  };

  // Renderiza cada card de torneio
  const renderTorneio = ({ item }) => {
    const vagasRestantes = item.vagas - item.vagasPreenchidas;
    const esgotado = vagasRestantes <= 0;
    const porcentagemVagas = (item.vagasPreenchidas / item.vagas) * 100;

    return (
      <View style={styles.card}>
        {/* Badge do esporte */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{item.esporte}</Text>
          </View>
          {esgotado && (
            <View style={styles.badgeEsgotado}>
              <Text style={styles.badgeEsgotadoTexto}>ESGOTADO</Text>
            </View>
          )}
        </View>

        {/* Nome do torneio */}
        <Text style={styles.cardNome}>{item.nome}</Text>

        {/* Descrição */}
        <Text style={styles.cardDescricao}>{item.descricao}</Text>

        {/* Detalhes */}
        <View style={styles.detalhesContainer}>
          <View style={styles.detalheLinha}>
            <FontAwesome5 name="calendar-alt" size={13} color={Colors.textMedium} />
            <Text style={styles.detalheTexto}>
              {item.data} às {item.horario}
            </Text>
          </View>
          <View style={styles.detalheLinha}>
            <FontAwesome5 name="map-marker-alt" size={13} color={Colors.textMedium} />
            <Text style={styles.detalheTexto}>{item.local}</Text>
          </View>
          <View style={styles.detalheLinha}>
            <FontAwesome5 name="trophy" size={13} color={Colors.warning} />
            <Text style={styles.detalheTexto}>{item.premiacao}</Text>
          </View>
        </View>

        {/* Barra de progresso de vagas */}
        <View style={styles.vagasContainer}>
          <View style={styles.vagasHeader}>
            <Text style={styles.vagasTexto}>
              {item.vagasPreenchidas}/{item.vagas} vagas ocupadas
            </Text>
            <Text style={[styles.vagasRestantes, esgotado && { color: Colors.danger }]}>
              {esgotado ? 'Lista de espera' : `${vagasRestantes} restantes`}
            </Text>
          </View>
          <View style={styles.barraFundo}>
            <View
              style={[
                styles.barraProgresso,
                {
                  width: `${Math.min(porcentagemVagas, 100)}%`,
                  backgroundColor: esgotado ? Colors.danger : Colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Rodapé do card: preço + botão */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.taxaLabel}>Taxa de inscrição</Text>
            <Text style={styles.taxaValor}>
              R$ {item.taxaInscricao.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.botaoInscrever, esgotado && styles.botaoEsgotado]}
            onPress={() => handleInscrever(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.botaoInscreverTexto}>
              {esgotado ? 'Lista de Espera' : 'Inscrever-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <FontAwesome5 name="trophy" size={20} color={Colors.primary} />
        <View style={styles.headerTexto}>
          <Text style={styles.headerTitulo}>Campeonatos</Text>
          <Text style={styles.headerSubtitulo}>
            {tournaments.length} torneios disponíveis
          </Text>
        </View>
      </View>

      {/* Lista de campeonatos */}
      <FlatList
        data={tournaments}
        renderItem={renderTorneio}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

// ---- Estilos ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: s(12),
    paddingBottom: s(6),
  },
  headerTexto: {
    marginLeft: s(10),
  },
  headerTitulo: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  headerSubtitulo: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginTop: s(2),
  },

  lista: {
    padding: s(16),
    paddingTop: s(6),
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: s(16),
    padding: s(16),
    marginBottom: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  badgeContainer: {
    flexDirection: 'row',
    gap: s(6),
    marginBottom: s(8),
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: s(10),
    paddingVertical: s(3),
    borderRadius: s(6),
  },
  badgeTexto: {
    fontSize: fs(10),
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeEsgotado: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.danger + '18',
    paddingHorizontal: s(10),
    paddingVertical: s(3),
    borderRadius: s(6),
  },
  badgeEsgotadoTexto: {
    fontSize: fs(10),
    fontWeight: '700',
    color: Colors.danger,
  },

  cardNome: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(4),
  },
  cardDescricao: {
    fontSize: fs(11),
    color: Colors.textMedium,
    lineHeight: fs(16),
    marginBottom: s(10),
  },

  detalhesContainer: {
    backgroundColor: Colors.background,
    padding: s(12),
    borderRadius: s(10),
    marginBottom: s(10),
  },
  detalheLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(6),
  },
  detalheTexto: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginLeft: s(8),
    flex: 1,
  },

  vagasContainer: {
    marginBottom: s(12),
  },
  vagasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(6),
  },
  vagasTexto: {
    fontSize: fs(10),
    color: Colors.textMedium,
  },
  vagasRestantes: {
    fontSize: fs(10),
    fontWeight: '600',
    color: Colors.success,
  },
  barraFundo: {
    height: s(5),
    backgroundColor: Colors.card,
    borderRadius: s(3),
    overflow: 'hidden',
  },
  barraProgresso: {
    height: s(5),
    borderRadius: s(3),
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: s(10),
    borderTopWidth: 1,
    borderTopColor: Colors.card,
  },
  taxaLabel: {
    fontSize: fs(9),
    color: Colors.textMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taxaValor: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: s(2),
  },
  botaoInscrever: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingVertical: s(10),
    borderRadius: s(10),
  },
  botaoEsgotado: {
    backgroundColor: Colors.textMedium,
  },
  botaoInscreverTexto: {
    color: Colors.white,
    fontSize: fs(12),
    fontWeight: 'bold',
  },
});
