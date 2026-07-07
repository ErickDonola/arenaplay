// ============================================================
// PerfilScreen.js — Arena Play Quadras
// Tela de perfil do usuário com dados dinâmicos.
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native'; // Importamos o useRoute
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';

// Item de menu reutilizável
function ItemMenu({ icone, label, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcone}>{icone}</Text>
      <Text style={[styles.menuLabel, danger && { color: Colors.danger }]}>
        {label}
      </Text>
      <Text style={styles.menuSeta}>›</Text>
    </TouchableOpacity>
  );
}

export default function PerfilScreen({ navigation }) {
  // Pega os parâmetros da rota que foram passados na navegação
  const route = useRoute();
  
  // Se o usuário logado veio nos parâmetros, a gente usa ele.
  // Se não veio (por algum erro), deixamos um visitante genérico pra não quebrar a tela.
  // Pega o usuário logado globalmente, se não achar, usa visitante
  const usuario = global.usuarioLogado || {
    nome: 'Visitante',
    email: 'email@exemplo.com',
    membro: 'hoje',
    reservas: 0,
    campeonatos: 0,
  };

  const handleSair = () => {
    // 1. Limpa o usuário da nossa variável global
    global.usuarioLogado = null;
    
    // 2. Acessa o navegador principal e reseta as rotas voltando pro Login
    const parent = navigation.getParent();
    if (parent) {
      parent.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar e dados do usuário */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {usuario.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nome}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <Text style={styles.membro}>Membro desde {usuario.membro || 'Jan/2026'}</Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{usuario.reservas || 12}</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>
        <View style={styles.statSeparador} />
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{usuario.campeonatos || 3}</Text>
          <Text style={styles.statLabel}>Torneios</Text>
        </View>
      </View>

      {/* Menu de opções */}
      <View style={styles.menuContainer}>
        <ItemMenu
          icone="👤"
          label="Editar Perfil"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
        />
        <ItemMenu
          icone="🔔"
          label="Notificações"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
        />
        <ItemMenu
          icone="💳"
          label="Métodos de Pagamento"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
        />
        <ItemMenu
          icone="ℹ️"
          label="Ajuda & Suporte"
          onPress={() => Alert.alert('Suporte', 'Contato: suporte@arenaplay.com.br')}
        />
        <ItemMenu
          icone="🚪"
          label="Sair"
          onPress={handleSair}
          danger
        />
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: s(26),
    paddingBottom: s(24),
  },
  avatar: {
    width: s(64),
    height: s(64),
    borderRadius: s(32),
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(10),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarLetra: {
    fontSize: fs(26),
    fontWeight: 'bold',
    color: Colors.white,
  },
  nome: {
    fontSize: fs(17),
    fontWeight: 'bold',
    color: Colors.white,
  },
  email: {
    fontSize: fs(11),
    color: 'rgba(255,255,255,0.8)',
    marginTop: s(3),
  },
  membro: {
    fontSize: fs(10),
    color: 'rgba(255,255,255,0.65)',
    marginTop: s(3),
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(-16),
    borderRadius: s(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: s(12),
  },
  statSeparador: {
    width: 1,
    backgroundColor: Colors.card,
    marginVertical: s(10),
  },
  statNumero: {
    fontSize: fs(20),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: fs(10),
    color: Colors.textMedium,
    marginTop: s(2),
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: s(16),
    marginTop: s(10),
    borderRadius: s(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  footer: {
    height: s(28),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(12),
    paddingHorizontal: s(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  menuIcone: {
    fontSize: fs(17),
    marginRight: s(12),
    width: s(22),
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: fs(13),
    color: Colors.textDark,
  },
  menuSeta: {
    fontSize: fs(17),
    color: Colors.textLight,
  },
});