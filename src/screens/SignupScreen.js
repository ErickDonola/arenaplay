// ============================================================
// Tela de Cadastro de Novo Usuário — Arena Play Quadras
// Formulário para registrar um novo usuário na API
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
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { userAPI } from '../services/api';

export default function SignupScreen({ navigation }) {
  // Estados dos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Validação de e-mail
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para criar novo usuário
  const handleCadastro = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Por favor, informe um e-mail válido.');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Atenção', 'Por favor, informe uma senha.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }

    try {
      setLoading(true);

      const dadosUsuario = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        avatar: null,
        dataCriacao: new Date().toISOString(),
      };

      const novoUsuario = await userAPI.create(dadosUsuario);

      setLoading(false);

      Alert.alert('Sucesso! 🎉', 'Seu cadastro foi realizado. Bem-vindo à Arena Play!', [
        {
          text: 'Entrar',
          onPress: () => {
            handleNavegacao();
          },
        },
      ]);

      // Navega automaticamente em 2 segundos como fallback
      setTimeout(() => {
        handleNavegacao();
      }, 2000);
    } catch (error) {
      setLoading(false);

      Alert.alert(
        'Erro ao criar conta',
        `${error.message || 'Não foi possível criar o usuário. Tente novamente.'}`
      );
    }
  };

  // Função auxiliar de navegação
  const handleNavegacao = () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Início' }],
      });
    } catch (navError) {
      try {
        navigation.navigate('Início');
      } catch (navError2) {
        // Fallback silencioso
      }
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
        {/* ---- Cabeçalho ---- */}
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={fs(28)} color={Colors.primary} />
        </TouchableOpacity>

        {/* ---- Logo ---- */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ---- Título ---- */}
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>
          Cadastre-se e comece a reservar suas quadras!
        </Text>

        {/* ---- Campo de Nome ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="João Silva"
            placeholderTextColor={Colors.textLight}
            value={nome}
            onChangeText={setNome}
            editable={!loading}
          />
        </View>

        {/* ---- Campo de E-mail ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu.email@exemplo.com"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* ---- Campo de Senha ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.senhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="••••••••"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.botaoVerSenha}
            >
              <Ionicons
                name={mostrarSenha ? 'eye' : 'eye-off'}
                size={fs(20)}
                color={Colors.textMedium}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Campo de Confirmar Senha ---- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.senhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="••••••••"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              style={styles.botaoVerSenha}
            >
              <Ionicons
                name={mostrarConfirmarSenha ? 'eye' : 'eye-off'}
                size={fs(20)}
                color={Colors.textMedium}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Botão Cadastrar ---- */}
        <TouchableOpacity
          style={[styles.botaoCadastrar, loading && styles.botaoDesabilitado]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.botaoCadastrarTexto}>Criar Conta</Text>
          )}
        </TouchableOpacity>

        {/* ---- Link de Login ---- */}
        <View style={styles.linkLogin}>
          <Text style={styles.linkTexto}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkTextoDestaque}>Faça Login</Text>
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

// ---- Estilos ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: s(28),
    paddingVertical: s(16),
  },

  // Botão voltar
  botaoVoltar: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    marginBottom: s(10),
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: s(20),
  },
  logo: {
    width: s(120),
    height: s(120),
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

  // Campos de senha com ícone de visualização
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.card,
    borderRadius: s(10),
    paddingHorizontal: s(14),
  },
  inputSenha: {
    flex: 1,
    paddingVertical: s(12),
    fontSize: fs(14),
    color: Colors.textDark,
  },
  botaoVerSenha: {
    paddingHorizontal: s(10),
    paddingVertical: s(8),
  },

  // Botão principal
  botaoCadastrar: {
    backgroundColor: Colors.primary,
    paddingVertical: s(14),
    borderRadius: s(10),
    alignItems: 'center',
    marginTop: s(20),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoCadastrarTexto: {
    color: Colors.white,
    fontSize: fs(15),
    fontWeight: 'bold',
  },

  // Link de login
  linkLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(16),
  },
  linkTexto: {
    color: Colors.textMedium,
    fontSize: fs(12),
  },
  linkTextoDestaque: {
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
