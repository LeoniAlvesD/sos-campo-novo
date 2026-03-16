import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface IMCResult {
  imc: number;
  classificacao: string;
  recomendacao: string;
  cor: string;
}

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<IMCResult | null>(null);

  const calcular = () => {
    const p = parseFloat(peso.replace(',', '.'));
    const a = parseFloat(altura.replace(',', '.'));

    if (!p || !a || a <= 0) {
      setErro('Preencha peso e altura corretamente.');
      setResultado(null);
      return;
    }

    setErro('');

    const imc = p / (a * a);

    let classificacao = '';
    let recomendacao = '';
    let cor = theme.colors.muted;

    if (imc < 18.5) {
      classificacao = 'Abaixo do peso';
      recomendacao = 'Busque orientação profissional para avaliação adequada.';
      cor = theme.colors.warning;
    } else if (imc < 25) {
      classificacao = 'Peso normal';
      recomendacao = 'Mantenha hábitos saudáveis e prática regular de atividades físicas.';
      cor = theme.colors.success;
    } else if (imc < 30) {
      classificacao = 'Sobrepeso';
      recomendacao = 'Considere ajustes na alimentação e rotina de exercícios.';
      cor = theme.colors.sobrepeso;
    } else {
      classificacao = 'Obesidade';
      recomendacao = 'Procure acompanhamento profissional para avaliação individualizada.';
      cor = theme.colors.danger;
    }

    setResultado({ imc, classificacao, recomendacao, cor });
  };

  const limpar = () => {
    setPeso('');
    setAltura('');
    setErro('');
    setResultado(null);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Calculadora de IMC"
        subtitle="Avalie seu índice de massa corporal"
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Input
          label="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          placeholder="Ex: 80"
          accessibilityLabel="Peso em quilogramas"
          returnKeyType="next"
        />

        <Input
          label="Altura (m)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          placeholder="Ex: 1.70"
          accessibilityLabel="Altura em metros"
          returnKeyType="done"
          onSubmitEditing={calcular}
          error={erro || undefined}
        />

        <Button
          label="Calcular IMC"
          variant="primary"
          size="lg"
          onPress={calcular}
          style={styles.calculateButton}
        />

        {resultado && (
          <View style={[styles.resultCard, { borderLeftColor: resultado.cor }]}>
            <Text style={styles.imcValue}>{resultado.imc.toFixed(2)}</Text>

            <Text style={[styles.classificacao, { color: resultado.cor }]}>
              {resultado.classificacao}
            </Text>

            <Text style={styles.recomendacao}>{resultado.recomendacao}</Text>

            <Text style={styles.disclaimer}>
              Este cálculo é informativo e não substitui avaliação profissional.
            </Text>

            <Pressable
              onPress={limpar}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Limpar resultados"
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.clearText}>Limpar</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },

  calculateButton: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },

  resultCard: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 6,
    ...theme.shadow.card,
  },

  imcValue: {
    fontSize: 36,
    fontWeight: theme.fontWeights.extrabold,
    textAlign: 'center',
    color: theme.colors.text,
  },

  classificacao: {
    fontSize: theme.font.md,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeights.semibold,
  },

  recomendacao: {
    marginTop: theme.spacing.md,
    fontSize: theme.font.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeights.relaxed,
  },

  disclaimer: {
    marginTop: theme.spacing.md,
    fontSize: theme.font.tiny,
    textAlign: 'center',
    color: theme.colors.placeholder,
    lineHeight: theme.lineHeights.normal,
  },

  clearButton: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
    minHeight: theme.minTouchSize,
    justifyContent: 'center',
  },

  clearText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.font.text,
  },
});