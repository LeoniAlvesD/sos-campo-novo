import { acidentes } from '@/constants/acidentes';
import { theme } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalheAcidente() {
  const { id } = useLocalSearchParams();

  const acidente = acidentes.find((item) => item.id === id);

  if (!acidente) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Informação não encontrada.</Text>
      </SafeAreaView>
    );
  }

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

        {/* AVISO LEGAL SUPERIOR */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Conteúdo informativo. Não substitui avaliação ou atendimento por profissional de saúde.
            Em caso de emergência, acione 192 (SAMU) ou 193 (Bombeiros).
          </Text>
        </View>

        <Image
          source={acidente.imagem}
          style={styles.image}
        />

        <View style={styles.content}>

          <Text style={styles.title}>
            {acidente.nome}
          </Text>

          <Text style={styles.description}>
            {acidente.descricao}
          </Text>

          <Text style={styles.sectionTitle}>
            O que fazer:
          </Text>

          {acidente.passos.map((passo, index) => (
            <Text key={index} style={styles.step}>
              • {passo}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>
            Não fazer:
          </Text>

          {acidente.naoFazer.map((item, index) => (
            <Text key={index} style={styles.danger}>
              ✖ {item}
            </Text>
          ))}

          {/* AVISO FINAL */}
          <View style={styles.footerWarning}>
            <Text style={styles.footerText}>
              Procure atendimento médico sempre que possível.
              Estas orientações são iniciais e não substituem avaliação profissional.
            </Text>
          </View>

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

  disclaimerBox: {
    backgroundColor: theme.colors.warningBg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },

  disclaimerText: {
    fontSize: theme.font.tiny,
    color: '#856404',
    textAlign: 'center',
  },

  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },

  content: {
    paddingBottom: theme.spacing.xxl,
  },

  title: {
    fontSize: theme.font.subtitle,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },

  description: {
    fontSize: theme.font.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
    lineHeight: theme.lineHeights.relaxed,
  },

  sectionTitle: {
    fontSize: theme.font.text,
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },

  step: {
    fontSize: theme.font.small,
    marginBottom: theme.spacing.xs,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeights.normal,
  },

  danger: {
    fontSize: theme.font.small,
    marginBottom: theme.spacing.xs,
    color: theme.colors.danger,
    lineHeight: theme.lineHeights.normal,
  },

  footerWarning: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.infoBg,
    borderRadius: theme.radius.sm,
  },

  footerText: {
    fontSize: theme.font.small,
    color: theme.colors.info,
    textAlign: 'center',
    lineHeight: theme.lineHeights.normal,
  },

});