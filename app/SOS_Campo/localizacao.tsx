<<<<<<< HEAD
import { createTable, deleteLocation, getLocations, insertLocation } from '@/hooks/useLocationDatabase';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocalizacaoScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
=======
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Share, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { createTable, insertLocation, getLocations, deleteLocation } from '@/hooks/useLocationDatabase';

export default function LocalizacaoScreen() {
  const [location, setLocation] = useState<any>(null);
  const [locations, setLocations] = useState<{ id: number; latitude: number; longitude: number; accuracy: number | null; timestamp: string }[]>([]);
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
  const [loading, setLoading] = useState(false);

  // Inicializar banco de dados
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await createTable();
      loadLocations();
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
    }
  };

  // Carregar localizações salvas
  const loadLocations = async () => {
    try {
      const savedLocations = await getLocations();
      setLocations(savedLocations);
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
    }
  };

  // Obter localização atual
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
=======
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, accuracy } = currentLocation.coords;
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930

      setLocation(currentLocation);
      setErrorMsg(null);

      // Salvar no banco de dados
      await saveLocation(currentLocation);
      
<<<<<<< HEAD
    } catch (error) {
      setErrorMsg('Erro ao obter localização');
=======
      const timestamp = new Date().toISOString();
      await insertLocation(latitude, longitude, accuracy, timestamp);
      
      Alert.alert('Localização marcada!', `Latitude: ${latitude.toFixed(4)}\nLongitude: ${longitude.toFixed(4)}`);
      
      loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Salvar localização no banco
  const saveLocation = async (loc: Location.LocationObject) => {
    try {
      const timestamp = new Date().toISOString();
      await insertLocation(
        loc.coords.latitude,
        loc.coords.longitude,
        loc.coords.accuracy || 0,
        timestamp
      );
      loadLocations();
      Alert.alert('Sucesso', 'Localização salva com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a localização');
      console.error(error);
    }
  };

  // Deletar localização
  const deleteLocationRecord = async (id: number) => {
    try {
      await deleteLocation(id);
<<<<<<< HEAD
=======
      Alert.alert('Deletado', 'Localização removida com sucesso');
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
      loadLocations();
      Alert.alert('Sucesso', 'Localização removida!');
    } catch (error) {
<<<<<<< HEAD
      Alert.alert('Erro', 'Não foi possível remover a localização');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Localização de Emergência</Text>
=======
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
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930

      {/* Botão para obter localização */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '⏳ Obtendo localização...' : '🔍 Obter Minha Localização'}
        </Text>
      </TouchableOpacity>

      {/* Exibir localização atual */}
      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>📌 Sua Localização Atual:</Text>
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Precisão: {location.coords.accuracy?.toFixed(2)}m
          </Text>
        </View>
      )}

<<<<<<< HEAD
      {/* Mensagem de erro */}
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
=======
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
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
      )}

      {/* Lista de localizações salvas */}
      <Text style={styles.subtitle}>📋 Histórico de Localizações:</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>
                📍 {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
              </Text>
              <Text style={styles.itemSubtitle}>
                Precisão: {item.accuracy.toFixed(2)}m
              </Text>
              <Text style={styles.itemTime}>
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteLocationRecord(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma localização salva ainda</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'rgb(135, 14, 93)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#880959',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
<<<<<<< HEAD
  locationBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
=======
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
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#666',
    fontFamily: 'monospace',
  },
<<<<<<< HEAD
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  itemTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 18,
=======
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
>>>>>>> 8641b9dd8730f75bed3b36c96e0fe45013467930
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
    marginTop: 20,
    fontSize: 14,
  },
});