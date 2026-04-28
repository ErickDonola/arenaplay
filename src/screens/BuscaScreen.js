// ============================================================
// BuscaScreen.js — Arena Play Quadras
// Tela de Busca: permite pesquisar quadras por esporte ou nome.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { sports } from '../data/mockData';

export default function BuscaScreen({ navigation }) {
  const [query, setQuery] = useState('');

  // Filtra os esportes pelo texto digitado
  const resultados = sports.filter((s) =>
    s.nome.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Campo de pesquisa */}
      <View style={styles.inputWrapper}>
        <Text style={styles.icone}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar esporte ou quadra..."
          placeholderTextColor={Colors.textLight}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={resultados}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum resultado encontrado.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Agendamento', { esporte: item })}
          >
            <Text style={styles.cardIcone}>{item.icone}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardPreco}>R$ {item.precoPorHora},00 / hora</Text>
            </View>
            <Text style={styles.seta}>›</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: s(14),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: s(10),
    paddingHorizontal: s(12),
    marginBottom: s(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icone: {
    fontSize: fs(16),
    marginRight: s(6),
  },
  input: {
    flex: 1,
    height: s(40),
    fontSize: fs(13),
    color: Colors.textDark,
  },
  vazio: {
    textAlign: 'center',
    marginTop: s(32),
    fontSize: fs(13),
    color: Colors.textLight,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: s(10),
    padding: s(14),
    marginBottom: s(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcone: {
    fontSize: fs(26),
    marginRight: s(12),
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: fs(14),
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  cardPreco: {
    fontSize: fs(11),
    color: Colors.primary,
    marginTop: s(2),
  },
  seta: {
    fontSize: fs(20),
    color: Colors.textLight,
  },
});
