import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationShare from '@/components/LocationShare';

const { width } = Dimensions.get('window');

export default function Emergencia() {
  const ligar = (numero: string) => {
    Linking.openURL(`tel:${numero}`);
  };

  const Card = ({
    label,
    title,
    number,
    displayNumber,
    style,
    stripe,
  }: {
    label: string;
    title: string;
    number: string;
    displayNumber?: string;
    style: any;
    stripe?: boolean;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.pressed,
      ]}
      onPress={() => ligar(number)}
    >
      {stripe && <View style={styles.prfStripeHorizontal} />}

      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardLabel}>{label}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        <Text style={styles.cardNumber}>
          {displayNumber ?? number}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergência</Text>
          <Text style={styles.subtitle}>
            Selecione o serviço que deseja acionar
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card
            label="Atendimento Médico"
            title="SAMU"
            number="192"
            style={styles.samu}
          />

          <Card
            label="Resgate e Incêndio"
            title="Bombeiros"
            number="193"
            style={styles.bombeiros}
          />

          <Card
            label="Segurança Pública"
            title="Polícia Militar"
            number="190"
            style={styles.policiaMilitar}
          />

          <Card
            label="Rodovias Federais"
            title="Polícia Rodoviária Federal"
            number="191"
            style={styles.prf}
            stripe
          />

          <Card
            label="Disque-Intoxicação"
            title="ANVISA"
            number="08007226001"
            displayNumber="0800 722 6001"
            style={styles.intoxicacao}
          />
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.locationSectionTitle}>Sua Localização</Text>
          <Text style={styles.locationSectionSubtitle}>
            Informe sua posição ao acionar um serviço de emergência
          </Text>
          <LocationShare title="Obter e Compartilhar Localização" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },

  cardsContainer: {
    gap: 18,
  },

  card: {
    width: '100%',
    minHeight: width * 0.28,
    borderRadius: 22,
    padding: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    paddingRight: 16,
  },

  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },

  cardLabel: {
    color: '#ffffffcc',
    fontSize: 12,
    marginBottom: 6,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  cardNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
  },

  /* CORES */

  samu: {
    backgroundColor: '#c62828',
  },

  bombeiros: {
    backgroundColor: '#ef6c00',
  },

  policiaMilitar: {
    backgroundColor: '#0d47a1',
  },

  prf: {
    backgroundColor: '#0b2e59',
  },

  intoxicacao: {
    backgroundColor: '#6a1b9a',
  },

  prfStripeHorizontal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#f5c518',
  },

  locationSection: {
    marginTop: 24,
    marginBottom: 12,
  },
  locationSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  locationSectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
});