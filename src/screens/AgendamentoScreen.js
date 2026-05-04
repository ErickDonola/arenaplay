// ============================================================
// Tela de Agendamento (Reserva) — Arena Play Quadras
// Permite ao usuário escolher data e horário para a quadra.
// ============================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { sportAPI, timesAPI } from '../services/api';

// Gera os próximos 7 dias a partir de hoje
const gerarProximosDias = () => {
  const dias = [];
  const hoje = new Date();
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    dias.push({
      id: String(i),
      dia: data.getDate(),
      diaSemana: diasSemana[data.getDay()],
      mes: meses[data.getMonth()],
      completa: `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`,
      ehHoje: i === 0,
    });
  }
  return dias;
};

export default function AgendamentoScreen({ route, navigation }) {
  // Esporte selecionado vindo da Home ou Busca (com fallback)
  const esporte = route.params?.esporte ?? null;

  // Se não recebeu esporte, exibe seleção
  const [esporteSelecionado, setEsporteSelecionado] = useState(esporte);

  // Estados de seleção
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  // Estados da API
  const [sports, setSports] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sportsData, timesData] = await Promise.all([
          sportAPI.getAll(),
          timesAPI.getAll(),
        ]);
        setSports(sportsData);
        setAvailableTimes(timesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Falha ao carregar os dados. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Gera os dias apenas uma vez
  const dias = useMemo(() => gerarProximosDias(), []);

  // Agrupa horários por período
  const horariosPorPeriodo = useMemo(() => {
    const grupos = {};
    availableTimes.forEach((t) => {
      if (!grupos[t.periodo]) grupos[t.periodo] = [];
      grupos[t.periodo].push(t);
    });
    return grupos;
  }, [availableTimes]);

  // Avança para a tela de equipamentos
  const handleContinuar = () => {
    if (!esporteSelecionado) {
      Alert.alert('Atenção', 'Selecione um esporte para continuar.');
      return;
    }
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atenção', 'Selecione uma data e um horário para continuar.');
      return;
    }
    navigation.navigate('Equipamentos', {
      esporte: esporteSelecionado,
      data: dataSelecionada,
      horario: horarioSelecionado,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---- Seleção de esporte (se não veio pré-selecionado) ---- */}
        {!esporte && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <FontAwesome5 name="volleyball-ball" size={s(14)} color={Colors.primary} />
              {'  '}Escolha o Esporte
            </Text>
            <View style={styles.esportesGrid}>
              {sports.map((sp) => {
                const selecionado = esporteSelecionado?.id === sp.id;
                return (
                  <TouchableOpacity
                    key={sp.id}
                    style={[
                      styles.esporteChip,
                      selecionado && { backgroundColor: sp.cor, borderColor: sp.cor },
                    ]}
                    onPress={() => setEsporteSelecionado(sp)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.esporteChipEmoji}>{sp.emoji}</Text>
                    <Text style={[styles.esporteChipNome, selecionado && { color: Colors.white }]}>
                      {sp.nome}
                    </Text>
                    <Text style={[styles.esporteChipPreco, selecionado && { color: 'rgba(255,255,255,0.8)' }]}>
                      R$ {sp.precoPorHora}/h
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ---- Informações do esporte selecionado ---- */}
        {esporteSelecionado && (
          <View style={[styles.sportHeader, { backgroundColor: esporteSelecionado.cor }]}>
            <FontAwesome5 name={esporteSelecionado.icone} size={s(28)} color={Colors.white} />
            <View style={styles.sportHeaderInfo}>
              <Text style={styles.sportHeaderNome}>{esporteSelecionado.nome}</Text>
              <Text style={styles.sportHeaderPreco}>
                R$ {esporteSelecionado.precoPorHora.toFixed(2)} / hora
              </Text>
            </View>
          </View>
        )}

        {/* ---- Seleção de data ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="calendar-alt" size={16} color={Colors.primary} />
            {'  '}Escolha a Data
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.diasContainer}
          >
            {dias.map((d) => {
              const selecionado = dataSelecionada?.id === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.diaCard,
                    selecionado && styles.diaCardSelecionado,
                  ]}
                  onPress={() => setDataSelecionada(d)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.diaSemana,
                      selecionado && styles.diaTextoSelecionado,
                    ]}
                  >
                    {d.ehHoje ? 'Hoje' : d.diaSemana}
                  </Text>
                  <Text
                    style={[
                      styles.diaNumero,
                      selecionado && styles.diaTextoSelecionado,
                    ]}
                  >
                    {d.dia}
                  </Text>
                  <Text
                    style={[
                      styles.diaMes,
                      selecionado && styles.diaTextoSelecionado,
                    ]}
                  >
                    {d.mes}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ---- Seleção de horário ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="clock" size={16} color={Colors.primary} />
            {'  '}Escolha o Horário
          </Text>

          {Object.entries(horariosPorPeriodo).map(([periodo, horarios]) => (
            <View key={periodo} style={styles.periodoContainer}>
              <Text style={styles.periodoLabel}>{periodo}</Text>
              <View style={styles.horariosGrid}>
                {horarios.map((h) => {
                  const selecionado = horarioSelecionado?.id === h.id;
                  return (
                    <TouchableOpacity
                      key={h.id}
                      style={[
                        styles.horarioChip,
                        !h.disponivel && styles.horarioIndisponivel,
                        selecionado && styles.horarioSelecionado,
                      ]}
                      onPress={() => h.disponivel && setHorarioSelecionado(h)}
                      activeOpacity={h.disponivel ? 0.7 : 1}
                      disabled={!h.disponivel}
                    >
                      <Text
                        style={[
                          styles.horarioTexto,
                          !h.disponivel && styles.horarioTextoIndisponivel,
                          selecionado && styles.horarioTextoSelecionado,
                        ]}
                      >
                        {h.horario}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Espaçamento para o botão fixo */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ---- Botão fixo no rodapé ---- */}
      <View style={styles.footer}>
        <View style={styles.footerResumo}>
          <Text style={styles.footerLabel}>Total da quadra</Text>
          <Text style={styles.footerValor}>
            R$ {esporteSelecionado ? esporteSelecionado.precoPorHora.toFixed(2) : '0.00'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.botaoContinuar,
            (!dataSelecionada || !horarioSelecionado) && styles.botaoDesabilitado,
          ]}
          onPress={handleContinuar}
          activeOpacity={0.7}
        >
          <Text style={styles.botaoContinuarTexto}>Continuar</Text>
          <FontAwesome5 name="arrow-right" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---- Estilos ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  sportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(16),
    marginHorizontal: s(16),
    marginTop: s(12),
    borderRadius: s(14),
  },
  sportHeaderInfo: {
    marginLeft: s(14),
  },
  sportHeaderNome: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.white,
  },
  sportHeaderPreco: {
    fontSize: fs(12),
    color: Colors.white + 'CC',
    marginTop: s(2),
  },

  section: {
    paddingHorizontal: s(16),
    marginTop: s(22),
  },
  sectionTitle: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(12),
  },

  // Seleção de esporte
  esportesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  esporteChip: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: s(12),
    padding: s(12),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  esporteChipEmoji: {
    fontSize: fs(28),
    marginBottom: s(6),
  },
  esporteChipNome: {
    fontSize: fs(12),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  esporteChipPreco: {
    fontSize: fs(10),
    color: Colors.textMedium,
    marginTop: s(2),
  },

  diasContainer: {
    paddingRight: s(16),
  },
  diaCard: {
    width: s(60),
    paddingVertical: s(10),
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: s(14),
    marginRight: s(8),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  diaCardSelecionado: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  diaSemana: {
    fontSize: fs(10),
    color: Colors.textMedium,
    fontWeight: '600',
  },
  diaNumero: {
    fontSize: fs(18),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginVertical: s(3),
  },
  diaMes: {
    fontSize: fs(10),
    color: Colors.textMedium,
  },
  diaTextoSelecionado: {
    color: Colors.white,
  },

  periodoContainer: {
    marginBottom: s(12),
  },
  periodoLabel: {
    fontSize: fs(11),
    fontWeight: '600',
    color: Colors.textMedium,
    marginBottom: s(6),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  horarioChip: {
    paddingHorizontal: s(16),
    paddingVertical: s(10),
    backgroundColor: Colors.white,
    borderRadius: s(10),
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  horarioSelecionado: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  horarioIndisponivel: {
    backgroundColor: Colors.card + '80',
    borderColor: Colors.card,
  },
  horarioTexto: {
    fontSize: fs(13),
    fontWeight: '600',
    color: Colors.textDark,
  },
  horarioTextoSelecionado: {
    color: Colors.white,
  },
  horarioTextoIndisponivel: {
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: s(20),
    paddingVertical: s(12),
    paddingBottom: s(24),
    borderTopWidth: 1,
    borderTopColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  footerResumo: {},
  footerLabel: {
    fontSize: fs(10),
    color: Colors.textMedium,
  },
  footerValor: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  botaoContinuar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: s(22),
    paddingVertical: s(12),
    borderRadius: s(10),
    gap: s(6),
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoContinuarTexto: {
    color: Colors.white,
    fontSize: fs(14),
    fontWeight: 'bold',
  },
});
