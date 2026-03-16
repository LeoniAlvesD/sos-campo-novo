import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="acidentes"
        options={{
          title: 'Acidentes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="medkit" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergencia"
        options={{
          title: 'Emergência',
          tabBarIcon: ({ color }) => (
            <Ionicons name="call" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculadora"
        options={{
          title: 'IMC',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calculator" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="localizacao"
        options={{
          title: 'Localização',
          tabBarIcon: ({ color }) => (
            <Ionicons name="location" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}