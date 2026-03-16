import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<{
    imc: number;
    classificacao: string;
    recomendacao: string;
    cor: string;
  } | null>(null);

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
    let cor = '#999';

    if (imc < 18.5) {
      classificacao = 'Abaixo do peso';
      recomendacao =
        'Busque orientação profissional para avaliação adequada.';
      cor = '#f39c12';
    } else if (imc < 25) {
      classificacao = 'Peso normal';
      recomendacao =
        'Mantenha hábitos saudáveis e prática regular de atividades físicas.';
      cor = '#2ecc71';
    } else if (imc < 30) {
      classificacao = 'Sobrepeso';
      recomendacao =
        'Considere ajustes na alimentação e rotina de exercícios.';
      cor = '#e67e22';
    } else {
      classificacao = 'Obesidade';
      recomendacao =
        'Procure acompanhamento profissional para avaliação individualizada.';
      cor = '#e74c3c';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Calculadora de IMC</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
            placeholder="Ex: 80"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
            placeholder="Ex: 1.70"
          />
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={calcular}
        >
          <Text style={styles.buttonText}>Calcular IMC</Text>
        </Pressable>

        {resultado && (
          <View style={[styles.resultCard, { borderLeftColor: resultado.cor }]}>
            <Text style={styles.imcValue}>
              {resultado.imc.toFixed(2)}
            </Text>

            <Text
              style={[styles.classificacao, { color: resultado.cor }]}
            >
              {resultado.classificacao}
            </Text>

            <Text style={styles.recomendacao}>
              {resultado.recomendacao}
            </Text>

            <Text style={styles.disclaimer}>
              Este cálculo é informativo e não substitui avaliação profissional.
            </Text>

            <Pressable onPress={limpar} style={styles.clearButton}>
              <Text style={styles.clearText}>Limpar</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  button: {
    backgroundColor: '#1f7a3f',
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 10,
    alignItems: 'center',
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  erro: {
    color: '#e74c3c',
    marginBottom: 10,
  },

  resultCard: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  imcValue: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },

  classificacao: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },

  recomendacao: {
    marginTop: 14,
    fontSize: 15,
    textAlign: 'center',
    color: '#4b5563',
  },

  disclaimer: {
    marginTop: 18,
    fontSize: 12,
    textAlign: 'center',
    color: '#9ca3af',
  },

  clearButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  clearText: {
    color: '#1f7a3f',
    fontWeight: '600',
  },
});