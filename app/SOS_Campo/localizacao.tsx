import ShareLocationModal from '@/components/ShareLocationModal';
import { theme } from '@/constants/theme';
import { createTable, deleteLocation, getLocations, insertLocation } from '@/hooks/useLocationDatabase';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocalizacaoScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locations, setLocations] = useState<{ id: number; latitude: number; longitude: number; accuracy: number | null; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);

  const loadLocations = useCallback(async () => {
    try {
      const savedLocations = await getLocations();
      setLocations(savedLocations);
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
    }
  }, []);

  const initializeDatabase = useCallback(async () => {
    try {
      await createTable();
      await loadLocations();
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
    }
  }, [loadLocations]);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar localização foi negada');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      const { latitude, longitude, accuracy } = currentLocation.coords;
      const timestamp = new Date().toISOString();
      await insertLocation(latitude, longitude, accuracy || 0, timestamp);

      Alert.alert('Sucesso', 'Localização marcada e salva!');
      await loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocationRecord = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja remover esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteLocation(id);
              Alert.alert('Sucesso', 'Localização removida!');
              await loadLocations();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover a localização');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleOpenShareModal = (item: { latitude: number; longitude: number; accuracy?: number | null }) => {
    setSelectedLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: item.accuracy ?? undefined,
    });
    setShareModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Marcar Localização</Text>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={getCurrentLocation}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={loading ? 'Obtendo localização' : 'Obter minha localização'}
        accessibilityState={{ busy: loading, disabled: loading }}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Obtendo localização...' : 'Obter Minha Localização'}
        </Text>
      </TouchableOpacity>

      {location && (
        <View style={styles.currentCard}>
          <Text style={styles.currentCardLabel}>LOCALIZAÇÃO ATUAL</Text>
          <View style={styles.coordRow}>
            <Text style={styles.coordKey}>Latitude</Text>
            <Text style={styles.coordValue}>{location.coords.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordDivider} />
          <View style={styles.coordRow}>
            <Text style={styles.coordKey}>Longitude</Text>
            <Text style={styles.coordValue}>{location.coords.longitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordDivider} />
          <View style={styles.coordRow}>
            <Text style={styles.coordKey}>Precisão</Text>
            <Text style={styles.coordValue}>{location.coords.accuracy?.toFixed(0)}{'\u00A0'}m</Text>
          </View>
        </View>
      )}

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Histórico de Localizações</Text>
        <View style={styles.historyBadge}>
          <Text style={styles.historyBadgeText}>{locations.length}</Text>
        </View>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View style={styles.historyCardLeft}>
              <View style={styles.historyAccent} />
            </View>
            <View style={styles.historyCardBody}>
              <Text style={styles.historyCoords} numberOfLines={1}>
                {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
              </Text>
              <Text style={styles.historyMeta}>
                Precisão: {item.accuracy?.toFixed(0)}{'\u00A0'}m
              </Text>
              <Text style={styles.historyTime}>
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </Text>
              <View style={styles.historyActions}>
                <TouchableOpacity
                  style={styles.actionShareBtn}
                  onPress={() => handleOpenShareModal(item)}
                  accessibilityRole="button"
                  accessibilityLabel="Compartilhar localização"
                >
                  <Text style={styles.actionShareText}>Compartilhar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionDeleteBtn}
                  onPress={() => deleteLocationRecord(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir localização"
                >
                  <Text style={styles.actionDeleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma localização salva ainda</Text>
          </View>
        }
        scrollEnabled={true}
      />

      {selectedLocation && (
        <ShareLocationModal
          visible={shareModalVisible}
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
          accuracy={selectedLocation.accuracy}
          onClose={() => setShareModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F8FAFC',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  currentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },

  currentCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  coordDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  coordKey: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },

  coordValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'monospace',
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  historyBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  historyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  historyCardLeft: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },

  historyAccent: {
    flex: 1,
  },

  historyCardBody: {
    flex: 1,
    padding: 14,
  },

  historyCoords: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  historyMeta: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },

  historyTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
  },

  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionShareBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionShareText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  actionDeleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionDeleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});