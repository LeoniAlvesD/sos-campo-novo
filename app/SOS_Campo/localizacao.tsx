import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { createTable, insertLocation, getLocations, deleteLocation } from '@/hooks/useLocationDatabase';

export default function LocalizacaoScreen() {
  const [location, setLocation] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
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
      const { latitude, longitude } = currentLocation.coords;

      setLocation(currentLocation);
      
      const timestamp = new Date().toLocaleString('pt-BR');
      await insertLocation(timestamp, latitude, longitude);
      
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

  const renderLocationItem = ({ item }: { item: any }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationCoords}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteLocation(item.id)}
      >
        <Text style={styles.deleteButtonText}>Deletar</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
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
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});
