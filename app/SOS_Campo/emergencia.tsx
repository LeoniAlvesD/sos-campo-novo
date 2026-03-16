import LocationShare from '@/components/LocationShare';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EmergencyCardProps {
  label: string;
  title: string;
  number: string;
  displayNumber?: string;
  color: string;
  stripe?: boolean;
}

function EmergencyCard({ label, title, number, displayNumber, color, stripe }: EmergencyCardProps) {
  const ligar = () => Linking.openURL(`tel:${number}`);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ligar para ${title}, número ${displayNumber ?? number}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color },
        pressed && styles.pressed,
      ]}
      onPress={ligar}
    >
      {stripe && <View style={styles.prfStripeHorizontal} />}

      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardLabel}>{label}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardNumber}>{displayNumber ?? number}</Text>
      </View>
    </Pressable>
  );
}

export default function Emergencia() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={theme.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text style={styles.backArrow}>← Voltar</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Emergência</Text>
          <Text style={styles.subtitle}>
            Selecione o serviço que deseja acionar
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <EmergencyCard
            label="Atendimento Médico"
            title="SAMU"
            number="192"
            color="#c62828"
          />
          <EmergencyCard
            label="Resgate e Incêndio"
            title="Bombeiros"
            number="193"
            color="#ef6c00"
          />
          <EmergencyCard
            label="Segurança Pública"
            title="Polícia Militar"
            number="190"
            color="#0d47a1"
          />
          <EmergencyCard
            label="Rodovias Federais"
            title="Polícia Rodoviária Federal"
            number="191"
            color="#0b2e59"
            stripe
          />
          <EmergencyCard
            label="Disque-Intoxicação"
            title="ANVISA"
            number="08007226001"
            displayNumber="0800 722 6001"
            color="#6a1b9a"
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
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },

  headerTop: {
    marginBottom: theme.spacing.sm,
  },

  backArrow: {
    fontSize: theme.font.text,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },

  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  title: {
    fontSize: theme.font.title,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },

  subtitle: {
    marginTop: theme.spacing.sm,
    fontSize: theme.font.small,
    color: theme.colors.muted,
  },

  cardsContainer: {
    gap: theme.spacing.md + 2,
  },

  card: {
    width: '100%',
    minHeight: theme.spacing.xxl + theme.spacing.xxl, // 80pt touch-friendly height
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadow.md,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },

  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },

  cardLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: theme.font.small,
    marginBottom: theme.spacing.xs,
  },

  cardTitle: {
    color: theme.colors.inverse,
    fontSize: theme.font.md,
    fontWeight: theme.fontWeights.semibold,
  },

  cardNumber: {
    color: theme.colors.inverse,
    fontSize: theme.font.xl,
    fontWeight: theme.fontWeights.bold,
    textAlign: 'right',
  },

  prfStripeHorizontal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#f5c518',
  },

  locationSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  locationSectionTitle: {
    fontSize: theme.font.subtitle,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  locationSectionSubtitle: {
    fontSize: theme.font.small,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
    lineHeight: theme.lineHeights.normal,
  },
});