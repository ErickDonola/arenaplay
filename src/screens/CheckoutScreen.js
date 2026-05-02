// ============================================================
// Tela de Checkout (Pagamento Digital) — Arena Play Quadras
// Exibe o resumo completo da reserva e simula métodos de pagamento.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';

// Métodos de pagamento disponíveis (mockados)
const metodosPagamento = [
  { id: 'pix', nome: 'Pix', icone: 'qrcode', descricao: 'Pagamento instantâneo' },
  { id: 'credito', nome: 'Cartão de Crédito', icone: 'credit-card', descricao: 'Até 3x sem juros' },
  { id: 'debito', nome: 'Cartão de Débito', icone: 'credit-card', descricao: 'Débito à vista' },
];

export default function CheckoutScreen({ route, navigation }) {
  // Dados vindos das telas anteriores
  const {
    esporte,
    data,
    horario,
    equipamentosSelecionados,
    totalEquipamentos,
    totalGeral,
  } = route.params;

  // Estado do método de pagamento selecionado
  const [metodoPagamento, setMetodoPagamento] = useState(null);

  // Confirma o pagamento (simulação)
  const handleConfirmar = () => {
    if (!metodoPagamento) {
      Alert.alert('Atenção', 'Selecione um método de pagamento.');
      return;
    }

    Alert.alert(
      '✅ Reserva Confirmada!',
      `Sua quadra de ${esporte.nome} foi reservada com sucesso!\n\n` +
        `📅 ${data.completa} às ${horario.horario}\n` +
        `💰 Total: R$ ${totalGeral.toFixed(2)}\n` +
        `💳 Pagamento via ${metodoPagamento.nome}`,
      [
        {
          text: 'Voltar ao Início',
          onPress: () => navigation.popToTop(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---- Título ---- */}
        <View style={styles.tituloContainer}>
          <FontAwesome5 name="receipt" size={20} color={Colors.primary} />
          <Text style={styles.titulo}>Resumo da Reserva</Text>
        </View>

        {/* ---- Card de resumo ---- */}
        <View style={styles.resumoCard}>
          {/* Esporte */}
          <View style={styles.resumoItem}>
            <View style={styles.resumoItemIcone}>
              <FontAwesome5 name={esporte.icone} size={16} color={Colors.primary} />
            </View>
            <View style={styles.resumoItemInfo}>
              <Text style={styles.resumoItemLabel}>Esporte</Text>
              <Text style={styles.resumoItemValor}>{esporte.nome}</Text>
            </View>
          </View>

          {/* Data */}
          <View style={styles.resumoItem}>
            <View style={styles.resumoItemIcone}>
              <FontAwesome5 name="calendar-alt" size={16} color={Colors.primary} />
            </View>
            <View style={styles.resumoItemInfo}>
              <Text style={styles.resumoItemLabel}>Data</Text>
              <Text style={styles.resumoItemValor}>
                {data.diaSemana}, {data.completa}
              </Text>
            </View>
          </View>

          {/* Horário */}
          <View style={styles.resumoItem}>
            <View style={styles.resumoItemIcone}>
              <FontAwesome5 name="clock" size={16} color={Colors.primary} />
            </View>
            <View style={styles.resumoItemInfo}>
              <Text style={styles.resumoItemLabel}>Horário</Text>
              <Text style={styles.resumoItemValor}>{horario.horario}h</Text>
            </View>
          </View>
        </View>

        {/* ---- Equipamentos Alugados ---- */}
        {equipamentosSelecionados.length > 0 && (
          <View style={styles.equipamentosCard}>
            <Text style={styles.cardTitulo}>Equipamentos</Text>
            {equipamentosSelecionados.map((eq) => (
              <View key={eq.id} style={styles.equipamentoLinha}>
                <Text style={styles.equipamentoNome}>
                  {eq.quantidade}x {eq.nome}
                </Text>
                <Text style={styles.equipamentoPreco}>
                  R$ {eq.subtotal.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ---- Valores ---- */}
        <View style={styles.valoresCard}>
          <Text style={styles.cardTitulo}>Valores</Text>

          <View style={styles.valorLinha}>
            <Text style={styles.valorLabel}>Quadra (1 hora)</Text>
            <Text style={styles.valorTexto}>
              R$ {esporte.precoPorHora.toFixed(2)}
            </Text>
          </View>

          {totalEquipamentos > 0 && (
            <View style={styles.valorLinha}>
              <Text style={styles.valorLabel}>Equipamentos</Text>
              <Text style={styles.valorTexto}>
                R$ {totalEquipamentos.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={[styles.valorLinha, styles.totalLinha]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>
              R$ {totalGeral.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ---- Métodos de Pagamento ---- */}
        <View style={styles.pagamentoSection}>
          <Text style={styles.pagamentoTitulo}>
            <FontAwesome5 name="wallet" size={16} color={Colors.primary} />
            {'  '}Forma de Pagamento
          </Text>

          {metodosPagamento.map((metodo) => {
            const selecionado = metodoPagamento?.id === metodo.id;
            return (
              <TouchableOpacity
                key={metodo.id}
                style={[
                  styles.metodoCard,
                  selecionado && styles.metodoCardSelecionado,
                ]}
                onPress={() => setMetodoPagamento(metodo)}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={metodo.icone}
                  size={20}
                  color={selecionado ? Colors.primary : Colors.textMedium}
                />
                <View style={styles.metodoInfo}>
                  <Text
                    style={[
                      styles.metodoNome,
                      selecionado && styles.metodoNomeSelecionado,
                    ]}
                  >
                    {metodo.nome}
                  </Text>
                  <Text style={styles.metodoDescricao}>{metodo.descricao}</Text>
                </View>
                {/* Indicador de seleção */}
                <View
                  style={[
                    styles.radioOuter,
                    selecionado && styles.radioOuterSelecionado,
                  ]}
                >
                  {selecionado && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Espaçamento para o botão fixo */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ---- Botão fixo de confirmação ---- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.botaoConfirmar,
            !metodoPagamento && styles.botaoDesabilitado,
          ]}
          onPress={handleConfirmar}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="lock" size={16} color={Colors.white} />
          <Text style={styles.botaoConfirmarTexto}>
            Confirmar Pagamento · R$ {totalGeral.toFixed(2)}
          </Text>
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

  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: s(12),
    paddingBottom: s(6),
    gap: s(8),
  },
  titulo: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  resumoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(10),
    padding: s(14),
    borderRadius: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  resumoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  resumoItemIcone: {
    width: s(34),
    height: s(34),
    borderRadius: s(10),
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  resumoItemInfo: {
    flex: 1,
  },
  resumoItemLabel: {
    fontSize: fs(10),
    color: Colors.textMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resumoItemValor: {
    fontSize: fs(13),
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: s(2),
  },

  equipamentosCard: {
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(10),
    padding: s(14),
    borderRadius: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitulo: {
    fontSize: fs(13),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(10),
  },
  equipamentoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(4),
  },
  equipamentoNome: {
    fontSize: fs(12),
    color: Colors.textMedium,
  },
  equipamentoPreco: {
    fontSize: fs(12),
    fontWeight: '600',
    color: Colors.textDark,
  },

  valoresCard: {
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(10),
    padding: s(14),
    borderRadius: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  valorLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(4),
  },
  valorLabel: {
    fontSize: fs(12),
    color: Colors.textMedium,
  },
  valorTexto: {
    fontSize: fs(12),
    fontWeight: '600',
    color: Colors.textDark,
  },
  totalLinha: {
    borderTopWidth: 1,
    borderTopColor: Colors.card,
    paddingTop: s(10),
    marginTop: s(6),
  },
  totalLabel: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  totalValor: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.primary,
  },

  pagamentoSection: {
    paddingHorizontal: s(16),
    marginTop: s(20),
  },
  pagamentoTitulo: {
    fontSize: fs(15),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(10),
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: s(12),
    borderRadius: s(12),
    marginBottom: s(8),
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metodoCardSelecionado: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  metodoInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  metodoNome: {
    fontSize: fs(13),
    fontWeight: '600',
    color: Colors.textDark,
  },
  metodoNomeSelecionado: {
    color: Colors.primary,
  },
  metodoDescricao: {
    fontSize: fs(10),
    color: Colors.textMedium,
    marginTop: s(2),
  },

  radioOuter: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelecionado: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: Colors.primary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  botaoConfirmar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: s(14),
    borderRadius: s(12),
    gap: s(8),
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoConfirmarTexto: {
    color: Colors.white,
    fontSize: fs(14),
    fontWeight: 'bold',
  },
});
