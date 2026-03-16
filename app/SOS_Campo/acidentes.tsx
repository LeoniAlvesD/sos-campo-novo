import { Header } from '@/components/Header';
import { acidentes } from '@/constants/acidentes';
import { theme } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Acidentes() {
  const { scale } = useResponsive();

  return (
    <View style={styles.screen}>
      <Header
        title="Primeiros Socorros"
        subtitle="Selecione o tipo de acidente para ver orientações"
        onBack={() => router.back()}
      />
      <FlatList
        data={acidentes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes de ${item.nome}`}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push(`/acidente/${item.id}`)}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.nome}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.descricao}
              </Text>
            </View>

            <View style={[styles.arrowContainer, { width: scale(40), height: scale(40), borderRadius: scale(20) }]}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg - 2,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.minTouchSize,
    ...theme.shadow.card,
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  textContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },

  title: {
    fontSize: theme.font.md,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },

  description: {
    fontSize: theme.font.small,
    color: theme.colors.muted,
    lineHeight: theme.lineHeights.normal,
  },

  arrowContainer: {
    backgroundColor: theme.colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 22,
    color: theme.colors.info,
    fontWeight: theme.fontWeights.bold,
  },
});