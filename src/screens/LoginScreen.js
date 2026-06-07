// ============================================================
// Tela de Login — Arena Play Quadras
// Tela inicial do app com campos de e-mail e senha.
// A autenticação é real, validada contra o backend (PostgreSQL).
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { userAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  // Estados dos campos de entrada
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função chamada ao pressionar "Entrar"
  // Valida as credenciais no backend (PostgreSQL)
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      await userAPI.login({
        email: email.trim().toLowerCase(),
        senha: senha,
      });
      setLoading(false);
      navigation.replace('Início');
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro ao entrar', 'E-mail ou senha inválidos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---- Logo da empresa ---- */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ---- Título ---- */}
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Faça login para reservar sua quadra
        </Text>

        {/* ---- Campo de E-mail ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* ---- Campo de Senha ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {/* ---- Botão Entrar ---- */}
        <TouchableOpacity
          style={[styles.botaoEntrar, loading && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.botaoEntrarTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* ---- Link para Criar Conta ---- */}
        <View style={styles.linkConta}>
          <Text style={styles.linkContaTexto}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkContaDestaque}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Rodapé ---- */}
        <Text style={styles.rodape}>
          Esportes de Areia & Lazer
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---- Estilos da tela de Login ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: s(28),
    paddingVertical: s(32),
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: s(20),
  },
  logo: {
    width: s(150),
    height: s(150),
    borderRadius: s(18),
  },

  // Textos de boas-vindas
  titulo: {
    fontSize: fs(24),
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: s(3),
  },
  subtitulo: {
    fontSize: fs(13),
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: s(26),
  },

  // Inputs
  inputContainer: {
    marginBottom: s(14),
  },
  label: {
    fontSize: fs(12),
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: s(5),
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.card,
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    fontSize: fs(14),
    color: Colors.textDark,
  },

  // Botão principal
  botaoEntrar: {
    backgroundColor: Colors.primary,
    paddingVertical: s(14),
    borderRadius: s(10),
    alignItems: 'center',
    marginTop: s(6),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoEntrarTexto: {
    color: Colors.white,
    fontSize: fs(15),
    fontWeight: 'bold',
  },

  // Link decorativo
  linkEsqueceu: {
    alignItems: 'center',
    marginTop: s(14),
  },
  linkTexto: {
    color: Colors.secondary,
    fontSize: fs(12),
  },

  // Link para criar conta
  linkConta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(16),
  },
  linkContaTexto: {
    color: Colors.textMedium,
    fontSize: fs(12),
  },
  linkContaDestaque: {
    color: Colors.primary,
    fontSize: fs(12),
    fontWeight: 'bold',
  },

  // Rodapé
  rodape: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: fs(10),
    marginTop: s(32),
    letterSpacing: 1,
  },
});
