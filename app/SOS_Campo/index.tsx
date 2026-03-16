import { theme } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NavButtonProps {
  title: string;
  description: string;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}

function NavButton({ title, description, color, onPress, accessibilityLabel }: NavButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonTitle}>{title}</Text>
      <Text style={styles.buttonDescription}>{description}</Text>
    </Pressable>
  );
}

export default function Home() {
  const { scale } = useResponsive();

  const logoSize = scale(110);

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
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
            accessible
            accessibilityLabel="Logo SOS Campo"
          />
          <Text style={styles.title}>SOS Campo</Text>
          <Text style={styles.subtitle}>
            Orientações rápidas para emergências no campo
          </Text>
        </View>

        {/* Botões Principais */}
        <View style={styles.buttonsContainer}>
          <NavButton
            title="Primeiros Socorros"
            description="Ações imediatas para situações de risco"
            color={theme.colors.primary}
            onPress={() => router.push('/SOS_Campo/acidentes')}
            accessibilityLabel="Acessar guia de primeiros socorros"
          />
          <NavButton
            title="Ligar para Emergência"
            description="Acione atendimento imediato"
            color={theme.colors.danger}
            onPress={() => router.push('/SOS_Campo/emergencia')}
            accessibilityLabel="Acessar contatos de emergência"
          />
          <NavButton
            title="Calculadora IMC"
            description="Avalie seu índice de massa corporal"
            color={theme.colors.emphasis}
            onPress={() => router.push('/SOS_Campo/calculadora')}
            accessibilityLabel="Abrir calculadora de IMC"
          />

        </View>

        {/* Área Jurídica */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalTitle}>Informações</Text>

          <Pressable
            onPress={() => router.push('/legal/fontes')}
            accessibilityRole="link"
            accessibilityLabel="Ver fontes e referências"
            hitSlop={theme.hitSlop}
          >
            <Text style={styles.legalLink}>Fontes e Referências</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/legal/termos')}
            accessibilityRole="link"
            accessibilityLabel="Ver termos de uso"
            hitSlop={theme.hitSlop}
          >
            <Text style={styles.legalLink}>Termos de Uso</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/legal/privacidade')}
            accessibilityRole="link"
            accessibilityLabel="Ver política de privacidade"
            hitSlop={theme.hitSlop}
          >
            <Text style={styles.legalLink}>Política de Privacidade</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },

  logo: {
    borderRadius: theme.radius.xl,
  },

  title: {
    fontSize: theme.font.title,
    fontWeight: theme.fontWeights.extrabold,
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.muted,
    fontSize: theme.font.body,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: theme.lineHeights.relaxed,
  },

  buttonsContainer: {
    marginTop: theme.spacing.sm,
  },

  button: {
    width: '100%',
    borderRadius: theme.radius.xl,
    paddingVertical: theme.spacing.lg - 2,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md + 2,
    minHeight: theme.minTouchSize,
    ...theme.shadow.card,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },

  buttonTitle: {
    color: theme.colors.inverse,
    fontSize: theme.font.md,
    fontWeight: theme.fontWeights.bold,
  },

  buttonDescription: {
    color: 'rgba(255,255,255,0.80)',
    marginTop: theme.spacing.xs,
    fontSize: theme.font.small,
    lineHeight: theme.lineHeights.normal,
  },

  legalContainer: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.md + 2,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  legalTitle: {
    fontSize: theme.font.small,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: theme.spacing.sm + 2,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  legalLink: {
    fontSize: theme.font.text,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeights.medium,
    lineHeight: theme.lineHeights.normal,
    paddingVertical: theme.spacing.sm,
  },
});