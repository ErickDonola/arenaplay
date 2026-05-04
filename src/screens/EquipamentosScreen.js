// ============================================================
// Tela de Locação de Equipamentos — Arena Play Quadras
// O usuário pode adicionar itens extras à reserva com + e -.
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { equipmentAPI } from '../services/api';

export default function EquipamentosScreen({ route, navigation }) {
  // Dados vindos da tela anterior (com fallback seguro)
  const esporte = route.params?.esporte ?? { nome: 'Quadra', precoPorHora: 0 };
  const data = route.params?.data ?? null;
  const horario = route.params?.horario ?? null;

  // Estado: quantidade de cada equipamento (mapa id → quantidade)
  const [quantidades, setQuantidades] = useState({});
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca dados da API
  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await equipmentAPI.getAll();
        setEquipments(data);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        Alert.alert('Erro', 'Falha ao carregar os equipamentos. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    loadEquipments();
  }, []);

  // Incrementa a quantidade de um equipamento
  const incrementar = (id) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Decrementa a quantidade de um equipamento (mínimo 0)
  const decrementar = (id) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  // Calcula o total dos equipamentos selecionados
  const calcularTotalEquipamentos = () => {
    return equipments.reduce((total, eq) => {
      const qtd = quantidades[eq.id] || 0;
      return total + eq.preco * qtd;
    }, 0);
  };

  // Monta a lista de equipamentos selecionados para o Checkout
  const getEquipamentosSelecionados = () => {
    return equipments
      .filter((eq) => (quantidades[eq.id] || 0) > 0)
      .map((eq) => ({
        ...eq,
        quantidade: quantidades[eq.id],
        subtotal: eq.preco * quantidades[eq.id],
      }));
  };

  const totalEquipamentos = calcularTotalEquipamentos();
  const totalGeral = esporte.precoPorHora + totalEquipamentos;

  // Navega para o Pagamento
  const handleContinuar = () => {
    navigation.navigate('Pagamento', {
      esporte,
      data,
      horario,
      equipamentosSelecionados: getEquipamentosSelecionados(),
      totalEquipamentos,
      totalGeral,
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
        {/* ---- Cabeçalho descritivo ---- */}
        <View style={styles.headerInfo}>
          <FontAwesome5 name="plus-circle" size={20} color={Colors.primary} />
          <View style={styles.headerTexto}>
            <Text style={styles.headerTitulo}>Equipamentos Extras</Text>
            <Text style={styles.headerSubtitulo}>
              Adicione itens para complementar sua reserva
            </Text>
          </View>
        </View>

        {/* ---- Lista de equipamentos ---- */}
        {equipments.map((equipamento) => {
          const qtd = quantidades[equipamento.id] || 0;
          return (
            <View key={equipamento.id} style={styles.equipamentoCard}>
              {/* Ícone */}
              <View style={styles.equipamentoIcone}>
                <FontAwesome5
                  name={equipamento.icone}
                  size={22}
                  color={Colors.primary}
                />
              </View>

              {/* Nome e preço */}
              <View style={styles.equipamentoInfo}>
                <Text style={styles.equipamentoNome}>{equipamento.nome}</Text>
                <Text style={styles.equipamentoPreco}>
                  R$ {equipamento.preco.toFixed(2)} / unidade
                </Text>
              </View>

              {/* Controles de quantidade ( - | qtd | + ) */}
              <View style={styles.quantidadeControle}>
                <TouchableOpacity
                  style={[
                    styles.botaoQtd,
                    qtd === 0 && styles.botaoQtdDesabilitado,
                  ]}
                  onPress={() => decrementar(equipamento.id)}
                  disabled={qtd === 0}
                >
                  <FontAwesome5 name="minus" size={12} color={qtd > 0 ? Colors.primary : Colors.textLight} />
                </TouchableOpacity>

                <Text style={styles.quantidadeTexto}>{qtd}</Text>

                <TouchableOpacity
                  style={styles.botaoQtd}
                  onPress={() => incrementar(equipamento.id)}
                >
                  <FontAwesome5 name="plus" size={12} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* ---- Resumo rápido ---- */}
        <View style={styles.resumoBox}>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoLabel}>Quadra ({esporte.nome})</Text>
            <Text style={styles.resumoValor}>
              R$ {esporte.precoPorHora.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoLabel}>Equipamentos</Text>
            <Text style={styles.resumoValor}>
              R$ {totalEquipamentos.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.resumoLinha, styles.resumoTotal]}>
            <Text style={styles.resumoTotalLabel}>Total</Text>
            <Text style={styles.resumoTotalValor}>
              R$ {totalGeral.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Espaçamento para o botão fixo */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ---- Rodapé fixo ---- */}
      <View style={styles.footer}>
        {/* Botão pular (sem equipamentos) */}
        <TouchableOpacity
          style={styles.botaoPular}
          onPress={() =>
            navigation.navigate('Pagamento', {
              esporte,
              data,
              horario,
              equipamentosSelecionados: [],
              totalEquipamentos: 0,
              totalGeral: esporte.precoPorHora,
            })
          }
        >
          <Text style={styles.botaoPularTexto}>Pular</Text>
        </TouchableOpacity>

        {/* Botão continuar */}
        <TouchableOpacity
          style={styles.botaoContinuar}
          onPress={handleContinuar}
          activeOpacity={0.7}
        >
          <Text style={styles.botaoContinuarTexto}>
            Continuar · R$ {totalGeral.toFixed(2)}
          </Text>
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

  headerInfo: {
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
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  headerSubtitulo: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginTop: s(2),
  },

  equipamentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(10),
    padding: s(12),
    borderRadius: s(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  equipamentoIcone: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipamentoInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  equipamentoNome: {
    fontSize: fs(13),
    fontWeight: '600',
    color: Colors.textDark,
  },
  equipamentoPreco: {
    fontSize: fs(11),
    color: Colors.textMedium,
    marginTop: s(2),
  },

  quantidadeControle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  botaoQtd: {
    width: s(30),
    height: s(30),
    borderRadius: s(8),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoQtdDesabilitado: {
    borderColor: Colors.card,
  },
  quantidadeTexto: {
    fontSize: fs(14),
    fontWeight: 'bold',
    color: Colors.textDark,
    width: s(24),
    textAlign: 'center',
  },

  resumoBox: {
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(20),
    padding: s(16),
    borderRadius: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(8),
  },
  resumoLabel: {
    fontSize: fs(12),
    color: Colors.textMedium,
  },
  resumoValor: {
    fontSize: fs(12),
    fontWeight: '600',
    color: Colors.textDark,
  },
  resumoTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.card,
    paddingTop: s(10),
    marginBottom: 0,
  },
  resumoTotalLabel: {
    fontSize: fs(14),
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  resumoTotalValor: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.primary,
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
  botaoPular: {
    paddingHorizontal: s(16),
    paddingVertical: s(12),
  },
  botaoPularTexto: {
    fontSize: fs(13),
    fontWeight: '600',
    color: Colors.textMedium,
  },
  botaoContinuar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: s(20),
    paddingVertical: s(12),
    borderRadius: s(10),
    gap: s(6),
  },
  botaoContinuarTexto: {
    color: Colors.white,
    fontSize: fs(13),
    fontWeight: 'bold',
  },
});
