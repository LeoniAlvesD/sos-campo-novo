import LocationShare from '@/components/LocationShare';
import { theme } from '@/constants/theme';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Localizacao() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Localização</Text>
          <Text style={styles.subtitle}>
            Obtenha e compartilhe sua posição atual em situações de emergência
          </Text>
        </View>

        <LocationShare title="Obter e Compartilhar Localização" />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Compartilhe suas coordenadas ao acionar serviços de emergência como
            SAMU (192) ou Bombeiros (193) para agilizar o atendimento.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
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
    textAlign: 'center',
    lineHeight: theme.lineHeights.normal,
    paddingHorizontal: theme.spacing.md,
  },

  infoBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.infoBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },

  infoText: {
    fontSize: theme.font.small,
    color: theme.colors.info,
    lineHeight: theme.lineHeights.normal,
  },
});