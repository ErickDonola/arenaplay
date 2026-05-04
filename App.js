// ============================================================
// App.js — Arena Play Quadras
// Ponto de entrada do aplicativo. Configura a navegação com:
//   - Stack Navigator (Login + fluxo de agendamento)
//   - Bottom Tab Navigator (Início, Meus Vídeos, Agenda, Perfil)
// ============================================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// ---- Telas do fluxo de agendamento (Stack) ----
import LoginScreen from './src/screens/LoginScreen';
import AgendamentoScreen from './src/screens/AgendamentoScreen';
import EquipamentosScreen from './src/screens/EquipamentosScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import CampeonatosScreen from './src/screens/CampeonatosScreen';
import BuscaScreen from './src/screens/BuscaScreen';

// ---- Telas do menu inferior (Tabs) ----
import HomeScreen from './src/screens/HomeScreen';
import MeusVideosScreen from './src/screens/MeusVideosScreen';
import MinhaAgendaScreen from './src/screens/MinhaAgendaScreen';
import PerfilScreen from './src/screens/PerfilScreen';

// Paleta de cores
import Colors from './src/theme/colors';
import { s, fs } from './src/theme/responsive';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Opções de header reutilizadas no Stack
const stackHeaderOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTintColor: Colors.white,
  headerTitleStyle: { fontWeight: 'bold', fontSize: fs(16) },
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: Colors.background },
};

// ============================================================
// Menu inferior com 4 abas
// ============================================================
function MenuInferior() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        // Ícone de cada aba (emoji simples, sem biblioteca externa)
        tabBarIcon: ({ focused }) => {
          const icones = {
            Início: '🏠',
            'Meus Vídeos': '🎬',
            Agenda: '📅',
            Perfil: '👤',
          };
          return (
            <Text style={{ fontSize: focused ? fs(20) : fs(18) }}>
              {icones[route.name] || '●'}
            </Text>
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.card,
          borderTopWidth: 1,
          height: s(76),
          paddingBottom: s(20),
          paddingTop: s(6),
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: fs(10),
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen
        name="Meus Vídeos"
        component={MeusVideosScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Meus Vídeos',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: 'bold', fontSize: fs(16) },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Início')} style={{ marginLeft: s(12) }}>
              <FontAwesome5 name="arrow-left" size={fs(16)} color={Colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Agenda"
        component={MinhaAgendaScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Minha Agenda',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: 'bold', fontSize: fs(16) },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Início')} style={{ marginLeft: s(12) }}>
              <FontAwesome5 name="arrow-left" size={fs(16)} color={Colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          headerShown: true,
          headerTitle: 'Meu Perfil',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: 'bold', fontSize: fs(16) },
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================
// Stack principal — envolve Login e o menu inferior
// ============================================================
export default function App() {
  const conteudo = (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={Colors.primary} />

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={stackHeaderOptions}
      >
        {/* Login — sem header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Menu inferior (Início, Vídeos, Agenda, Perfil) */}
        <Stack.Screen
          name="Início"
          component={MenuInferior}
          options={{ headerShown: false }}
        />

        {/* Fluxo de agendamento — acessado a partir da Home */}
        <Stack.Screen
          name="Agendamento"
          component={AgendamentoScreen}
          options={{ title: 'Agendar Quadra' }}
        />
        <Stack.Screen
          name="Equipamentos"
          component={EquipamentosScreen}
          options={{ title: 'Equipamentos' }}
        />
        <Stack.Screen
          name="Pagamento"
          component={CheckoutScreen}
          options={{ title: 'Pagamento' }}
        />
        <Stack.Screen
          name="Campeonatos"
          component={CampeonatosScreen}
          options={{ title: 'Campeonatos' }}
        />
        <Stack.Screen
          name="Busca"
          component={BuscaScreen}
          options={{ title: 'Buscar Quadras' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Na web, envolve em container centralizado com largura máxima de celular
  if (Platform.OS === 'web') {
    return (
      <View style={webStyles.wrapper}>
        <View style={webStyles.phone}>{conteudo}</View>
      </View>
    );
  }

  return conteudo;
}

const webStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#e8e4de',
    alignItems: 'center',
  },
  phone: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
});
