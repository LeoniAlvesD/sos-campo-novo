import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Share, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { createTable, insertLocation, getLocations, deleteLocation } from '@/hooks/useLocationDatabase';

export default function LocalizacaoScreen() {
  const [location, setLocation] = useState<any>(null);
  const [locations, setLocations] = useState<{ id: number; latitude: number; longitude: number; accuracy: number | null; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeDatabase();
    requestLocationPermission();
  }, []);

  const initializeDatabase = async () => {
    try {
      await createTable();
      loadLocations();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à sua localização');
        return;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const markCurrentLocation = async () => {
    setLoading(true);
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, accuracy } = currentLocation.coords;

      setLocation(currentLocation);
      
      const timestamp = new Date().toISOString();
      await insertLocation(latitude, longitude, accuracy, timestamp);
      
      Alert.alert('Localização marcada!', `Latitude: ${latitude.toFixed(4)}\nLongitude: ${longitude.toFixed(4)}`);
      
      loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const locationsData = await getLocations();
      setLocations(locationsData || []);
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
      setLocations([]);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      await deleteLocation(id);
      Alert.alert('Deletado', 'Localização removida com sucesso');
      loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a localização');
    }
  };

  const handleCopyLocation = async (latitude: number, longitude: number) => {
    const text = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado!', `Coordenadas copiadas:\n${text}`);
  };

  const handleShareLocation = async (latitude: number, longitude: number) => {
    const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `Localização:\n${coords}\n\nAbrir no Google Maps:\n${mapsUrl}`;
    try {
      await Share.share({ message, url: mapsUrl });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar a localização.');
    }
  };

  const handleOpenMaps = (latitude: number, longitude: number) => {
    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    Linking.openURL(mapsUrl).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.')
    );
  };

  const renderLocationItem = ({ item }: { item: { id: number; latitude: number; longitude: number; accuracy: number | null; timestamp: string } }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{new Date(item.timestamp).toLocaleString('pt-BR')}</Text>
        <Text style={styles.locationCoords}>
          {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
        </Text>
      </View>
      <View style={styles.locationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCopyLocation(item.latitude, item.longitude)}
        >
          <Text style={styles.actionButtonText}>Copiar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => handleShareLocation(item.latitude, item.longitude)}
        >
          <Text style={styles.actionButtonText}>Compartilhar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.mapsButton]}
          onPress={() => handleOpenMaps(item.latitude, item.longitude)}
        >
          <Text style={styles.actionButtonText}>Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteLocation(item.id)}
        >
          <Text style={styles.actionButtonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marcador de Localização Offline</Text>

      {location && (
        <View style={styles.currentLocationBox}>
          <Text style={styles.currentLocationTitle}>Localização Atual:</Text>
          <Text style={styles.currentLocationText}>
            Lat: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.currentLocationText}>
            Long: {location.coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.markButton, loading && styles.markButtonDisabled]}
        onPress={markCurrentLocation}
        disabled={loading}
      >
        <Text style={styles.markButtonText}>
          {loading ? 'Obtendo localização...' : 'Marcar Localização Atual'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>
        Histórico ({locations.length})
      </Text>

      {locations.length > 0 ? (
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          scrollEnabled={true}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhuma localização marcada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  currentLocationBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  currentLocationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  currentLocationText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  markButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  markButtonDisabled: {
    backgroundColor: '#90CAF9',
  },
  markButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  locationInfo: {
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  locationActions: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#388E3C',
  },
  mapsButton: {
    backgroundColor: '#E65100',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});
