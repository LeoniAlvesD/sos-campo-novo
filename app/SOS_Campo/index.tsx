import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>SOS Campo</Text>

          <Text style={styles.subtitle}>
            Orientações rápidas para emergências no campo
          </Text>
        </View>

        {/* Botões Principais */}
        <View style={styles.buttonsContainer}>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/SOS_Campo/acidentes')}
          >
            <Text style={styles.buttonTitle}>Primeiros Socorros</Text>
            <Text style={styles.buttonDescription}>
              Ações imediatas para situações de risco
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.danger,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/SOS_Campo/emergencia')}
          >
            <Text style={styles.buttonTitle}>Ligar para Emergência</Text>
            <Text style={styles.buttonDescription}>
              Acione atendimento imediato
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondary,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/SOS_Campo/calculadora')}
          >
            <Text style={styles.buttonTitle}>Calculadora IMC</Text>
            <Text style={styles.buttonDescription}>
              Avalie seu índice de massa corporal
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.location,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/SOS_Campo/localizacao')}
          >
            <Text style={styles.buttonTitle}>Marcar Localização</Text>
            <Text style={styles.buttonDescription}>
<<<<<<< HEAD
              Registre sua posição GPS
=======
              Registre sua posição GPS offline
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
            </Text>
          </Pressable>

        </View>

        {/* Área Jurídica */}
        <View style={styles.legalContainer}>

          <Text style={styles.legalTitle}>Informações</Text>

          <Pressable onPress={() => router.push('/legal/fontes')}>
            <Text style={styles.legalLink}>Fontes e Referências</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/legal/termos')}>
            <Text style={styles.legalLink}>Termos de Uso</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/legal/privacidade')}>
            <Text style={styles.legalLink}>Política de Privacidade</Text>
          </Pressable>

        </View>

      </ScrollView>
    </SafeAreaView>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginTop: width * 0.12,
    marginBottom: width * 0.08,
  },

  logo: {
    width: width * 0.28,
    height: width * 0.28,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    color: '#1f2937',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    color: '#6b7280',
    fontSize: 15,
    paddingHorizontal: 20,
    lineHeight: 20,
  },

  buttonsContainer: {
    marginTop: 10,
  },

  button: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },

  primary: {
    backgroundColor: '#1f7a3f',
  },

  danger: {
    backgroundColor: '#b83227',
  },

  secondary: {
    backgroundColor: '#334155',
  },

  location: {
    backgroundColor: '#2563eb',
  },

  buttonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  buttonDescription: {
    color: '#ffffffcc',
    marginTop: 6,
    fontSize: 14,
  },

  legalContainer: {
    marginTop: 30,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  legalTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    color: '#6b7280',
  },

  legalLink: {
    fontSize: 14,
    color: '#1f7a3f',
    marginBottom: 8,
    fontWeight: '500',
  },});