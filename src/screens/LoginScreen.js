// ============================================================
// Tela de Login — Arena Play Quadras
// Tela inicial do app com campos de e-mail e senha.
// A autenticação é real, validada contra o backend (PostgreSQL).
// ============================================================

// ============================================================
// Tela de Login — Arena Play Quadras
// Tela inicial do app com campos de e-mail e senha.
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
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função chamada ao pressionar "Entrar"
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      alert('Atenção: Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      
      // Busca todos os usuários no db.json e verifica se existe um match
      const usuarios = await userAPI.getAll();
      const usuarioValido = usuarios.find(
        (u) => u.email === email.trim().toLowerCase() && u.senha === senha
      );

      setLoading(false);

      if (usuarioValido) {
        // Salva o usuário globalmente para TODAS as abas terem acesso
        global.usuarioLogado = usuarioValido; 
        navigation.replace('Início');
      } else {
        alert('Erro ao entrar: E-mail ou senha inválidos.');
      }
    } catch (error) {
      setLoading(false);
      alert('Erro de conexão com o banco de dados.');
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
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Faça login para reservar sua quadra
        </Text>

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

        <View style={styles.linkConta}>
          <Text style={styles.linkContaTexto}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkContaDestaque}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rodape}>
          Esportes de Areia & Lazer
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: s(28), paddingVertical: s(32) },
  logoContainer: { alignItems: 'center', marginBottom: s(20) },
  logo: { width: s(150), height: s(150), borderRadius: s(18) },
  titulo: { fontSize: fs(24), fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: s(3) },
  subtitulo: { fontSize: fs(13), color: Colors.textMedium, textAlign: 'center', marginBottom: s(26) },
  inputContainer: { marginBottom: s(14) },
  label: { fontSize: fs(12), fontWeight: '600', color: Colors.textDark, marginBottom: s(5) },
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.card, borderRadius: s(10), paddingHorizontal: s(14), paddingVertical: s(12), fontSize: fs(14), color: Colors.textDark },
  botaoEntrar: { backgroundColor: Colors.primary, paddingVertical: s(14), borderRadius: s(10), alignItems: 'center', marginTop: s(6), shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  botaoDesabilitado: { opacity: 0.6 },
  botaoEntrarTexto: { color: Colors.white, fontSize: fs(15), fontWeight: 'bold' },
  linkConta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: s(16) },
  linkContaTexto: { color: Colors.textMedium, fontSize: fs(12) },
  linkContaDestaque: { color: Colors.primary, fontSize: fs(12), fontWeight: 'bold' },
  rodape: { textAlign: 'center', color: Colors.textLight, fontSize: fs(10), marginTop: s(32), letterSpacing: 1 },
});