import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { theme } from '@/constants/theme';

interface Coords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface LocationShareProps {
  /** Label shown above the component. Defaults to "Compartilhar Localização". */
  title?: string;
}

export default function LocationShare({ title = 'Compartilhar Localização' }: LocationShareProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
    : null;

  const coordsText = coords
    ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
    : null;

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada.');
        return;
      }
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoords({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
      });
    } catch {
      setError('Não foi possível obter a localização.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!coords || !coordsText) return;
    await Clipboard.setStringAsync(coordsText);
    Alert.alert('Copiado!', `Coordenadas copiadas:\n${coordsText}`);
  };

  const shareLocation = async () => {
    if (!coords || !mapsUrl || !coordsText) return;
    const message = `Minha localização atual:\n${coordsText}\n\nAbrir no Google Maps:\n${mapsUrl}`;
    try {
      await Share.share({ message, url: mapsUrl });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar a localização.');
    }
  };

  const openMaps = () => {
    if (!mapsUrl) return;
    Linking.openURL(mapsUrl).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}

      {coords && (
        <View style={styles.coordsBox}>
          <Text style={styles.coordsLabel}>COORDENADAS</Text>
          <Text style={styles.coordsText}>{coordsText}</Text>
          {coords.accuracy != null && (
            <Text style={styles.accuracyText}>
              Precisão: {coords.accuracy.toFixed(0)}{'\u00A0'}m
            </Text>
          )}
          <TouchableOpacity
            onPress={openMaps}
            activeOpacity={0.8}
            accessibilityRole="link"
            accessibilityLabel="Abrir no Google Maps"
          >
            <Text style={styles.mapsLink} numberOfLines={1}>{mapsUrl}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={getLocation}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={coords ? 'Atualizar localização' : 'Obter localização'}
        accessibilityState={{ busy: loading, disabled: loading }}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.inverse} />
        ) : (
          <Text style={styles.primaryButtonText}>
            {coords ? 'Atualizar Localização' : 'Obter Localização'}
          </Text>
        )}
      </TouchableOpacity>

      {coords && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnCopy]}
            onPress={copyToClipboard}
            accessibilityRole="button"
            accessibilityLabel="Copiar coordenadas"
          >
            <Text style={[styles.actionBtnText, styles.actionBtnTextDark]} numberOfLines={1}>Copiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnShare]}
            onPress={shareLocation}
            accessibilityRole="button"
            accessibilityLabel="Compartilhar localização"
          >
            <Text style={styles.actionBtnText} numberOfLines={1}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnMaps]}
            onPress={openMaps}
            accessibilityRole="button"
            accessibilityLabel="Abrir no Maps"
          >
            <Text style={styles.actionBtnText} numberOfLines={1}>Maps</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 14,
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    marginBottom: 10,
  },

  coordsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },

  coordsLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  coordsText: {
    fontSize: 13,
    color: '#0F172A',
    fontFamily: 'monospace',
    fontWeight: '600',
    marginBottom: 4,
  },

  accuracyText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },

  mapsLink: {
    fontSize: 11,
    color: theme.colors.info,
    textDecorationLine: 'underline',
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  actionBtnCopy: {
    backgroundColor: '#F1F5F9',
  },

  actionBtnShare: {
    backgroundColor: theme.colors.primary,
  },

  actionBtnMaps: {
    backgroundColor: '#EA580C',
  },

  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  actionBtnTextDark: {
    color: '#334155',
  },
});
