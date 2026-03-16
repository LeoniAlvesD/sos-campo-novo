import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Linking,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';

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

      {error && <Text style={styles.errorText}>{error}</Text>}

      {coords && (
        <View style={styles.coordsBox}>
          <Text style={styles.coordsLabel}>Coordenadas:</Text>
          <Text style={styles.coordsText}>{coordsText}</Text>
          {coords.accuracy != null && (
            <Text style={styles.accuracyText}>
              Precisão: {coords.accuracy.toFixed(0)} m
            </Text>
          )}
          <TouchableOpacity onPress={openMaps} activeOpacity={0.8}>
            <Text style={styles.mapsLink}>{mapsUrl}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
        onPress={getLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {coords ? 'Atualizar Localização' : 'Obter Localização'}
          </Text>
        )}
      </TouchableOpacity>

      {coords && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, styles.actionButton]}
            onPress={copyToClipboard}
          >
            <Text style={styles.buttonText}>Copiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonGreen, styles.actionButton]}
            onPress={shareLocation}
          >
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMaps, styles.actionButton]}
            onPress={openMaps}
          >
            <Text style={styles.buttonText}>Maps</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  errorText: {
    color: '#f44336',
    fontSize: 13,
    marginBottom: 8,
  },
  coordsBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  coordsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  mapsLink: {
    fontSize: 12,
    color: '#1565C0',
    textDecorationLine: 'underline',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#607D8B',
  },
  buttonGreen: {
    backgroundColor: '#388E3C',
  },
  buttonMaps: {
    backgroundColor: '#E65100',
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});
