// ============================================================
// BuscaScreen.js — Arena Play Quadras
// Tela de Busca: permite pesquisar quadras por esporte ou nome.
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location'; // IMPORT NOVO DA GEOLOCALIZAÇÃO
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { sportAPI } from '../services/api';

export default function BuscaScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados da Geolocalização
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  const [locLoading, setLocLoading] = useState(true);

  // Busca dados da API e Localização simultaneamente
  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await sportAPI.getAll();
        setSports(data);
      } catch (error) {
        console.error('Erro ao carregar esportes:', error);
        Alert.alert('Erro', 'Falha ao carregar os esportes. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    const loadLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Permissão negada');
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        setLocError('Erro ao buscar localização');
      } finally {
        setLocLoading(false);
      }
    };

    loadSports();
    loadLocation(); // Chama a função de localização ao abrir a tela
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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

      {/* CARD DE GEOLOCALIZAÇÃO IMPLEMENTADO AQUI */}
      <View style={styles.locCard}>
        <Text style={styles.locTitle}>📍 Minha Localização</Text>
        {locLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: s(4) }} />
        ) : locError ? (
          <Text style={styles.locTextError}>{locError}</Text>
        ) : location ? (
          <Text style={styles.locText}>
            Lat: {location.coords.latitude.toFixed(5)} | Lng: {location.coords.longitude.toFixed(5)}
          </Text>
        ) : null}
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
            <Text style={styles.cardIcone}>{item.emoji}</Text>
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
    marginBottom: s(10), // Ajustado para dar espaço ao card de loc
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
  // ESTILOS NOVOS PARA A GEOLOCALIZAÇÃO
  locCard: {
    backgroundColor: Colors.white,
    borderRadius: s(10),
    padding: s(12),
    marginBottom: s(16),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locTitle: {
    fontSize: fs(13),
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: s(4),
  },
  locText: {
    fontSize: fs(12),
    color: Colors.primary,
  },
  locTextError: {
    fontSize: fs(12),
    color: 'red',
  },
  // FIM ESTILOS GEOLOCALIZAÇÃO
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