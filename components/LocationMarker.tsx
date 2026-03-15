import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Network from 'expo-network';
import { useLocationDatabase } from '../hooks/useLocationDatabase';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { LocationRecord, formatarData } from '../utils/locationStorage';

export default function LocationMarker() {
  const { localizacoes, carregando, salvar, deletar } = useLocationDatabase();
  const { coordenada, obtendo, erro, obterLocalizacao } = useLocationTracking();
  const [descricao, setDescricao] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [temInternet, setTemInternet] = useState(false);

  useEffect(() => {
    Network.getNetworkStateAsync().then((state) => {
      setTemInternet(state.isConnected ?? false);
    });
  }, []);

  const handleMarcarLocalizacao = async () => {
    const pos = await obterLocalizacao();
    if (pos) {
      setModalVisivel(true);
    }
  };

  const handleSalvar = async () => {
    if (!coordenada) return;
    await salvar(coordenada.latitude, coordenada.longitude, coordenada.accuracy, descricao.trim());
    setDescricao('');
    setModalVisivel(false);
  };

  const handleDeletar = (item: LocationRecord) => {
    Alert.alert(
      'Deletar Localização',
      'Deseja remover esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => deletar(item.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: LocationRecord }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemDescricao} numberOfLines={1}>
          {item.descricao || 'Localização sem descrição'}
        </Text>
        <Text style={styles.itemCoordenadas}>
          {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
        </Text>
        {item.accuracy !== null && (
          <Text style={styles.itemPrecisao}>
            Precisão: ±{Math.round(item.accuracy)} m
          </Text>
        )}
        <Text style={styles.itemData}>{formatarData(item.timestamp)}</Text>
      </View>
      <View style={styles.itemAcoes}>
        {item.sincronizado === 1 ? (
          <Text style={styles.sincronizadoTag}>✓ Sync</Text>
        ) : (
          <Text style={styles.pendenteSyncTag}>⏳ Pendente</Text>
        )}
        <Pressable
          style={({ pressed }) => [styles.btnDeletar, pressed && styles.pressed]}
          onPress={() => handleDeletar(item)}
        >
          <Text style={styles.btnDeletarTexto}>✕</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>📍 Localização Offline</Text>
        <View style={[styles.badge, temInternet ? styles.badgeOnline : styles.badgeOffline]}>
          <Text style={styles.badgeTexto}>
            {temInternet ? '🌐 Online' : '📡 Offline'}
          </Text>
        </View>
      </View>

      {/* Botão de marcar */}
      <Pressable
        style={({ pressed }) => [styles.btnMarcar, pressed && styles.pressed, obtendo && styles.btnDesabilitado]}
        onPress={handleMarcarLocalizacao}
        disabled={obtendo}
      >
        {obtendo ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.btnMarcarTexto}>📌 Marcar Localização Atual</Text>
        )}
      </Pressable>

      {/* Erro de localização */}
      {erro ? (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
        </View>
      ) : null}

      {/* Lista de localizações */}
      <Text style={styles.subtitulo}>
        Histórico ({localizacoes.length})
      </Text>

      {carregando ? (
        <ActivityIndicator style={styles.loadingLista} size="large" color="#2e7d32" />
      ) : localizacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhuma localização marcada.</Text>
          <Text style={styles.vazioSub}>{'Toque em "Marcar Localização Atual" para começar.'}</Text>
        </View>
      ) : (
        <FlatList
          data={localizacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          scrollEnabled={false}
        />
      )}

      {/* Modal de descrição */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Descreva o local</Text>

            {coordenada && (
              <View style={styles.modalCoordenadas}>
                <Text style={styles.modalCoordenadaTexto}>
                  Lat: {coordenada.latitude.toFixed(6)}
                </Text>
                <Text style={styles.modalCoordenadaTexto}>
                  Lon: {coordenada.longitude.toFixed(6)}
                </Text>
                {coordenada.accuracy !== null && (
                  <Text style={styles.modalCoordenadaTexto}>
                    Precisão: ±{Math.round(coordenada.accuracy)} m
                  </Text>
                )}
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder={'Ex: Campo lote 5, porteira principal...'}
              placeholderTextColor="#9ca3af"
              value={descricao}
              onChangeText={setDescricao}
              maxLength={120}
              multiline
            />

            <View style={styles.modalBotoes}>
              <Pressable
                style={({ pressed }) => [styles.btnCancelar, pressed && styles.pressed]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.btnSalvar, pressed && styles.pressed]}
                onPress={handleSalvar}
              >
                <Text style={styles.btnSalvarTexto}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeOnline: {
    backgroundColor: '#e8f5e9',
  },

  badgeOffline: {
    backgroundColor: '#fff3e0',
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },

  btnMarcar: {
    backgroundColor: '#2e7d32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  btnDesabilitado: {
    backgroundColor: '#a5d6a7',
  },

  btnMarcarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  erroBox: {
    marginTop: 12,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 12,
  },

  erroTexto: {
    color: '#c62828',
    fontSize: 13,
    textAlign: 'center',
  },

  subtitulo: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  loadingLista: {
    marginTop: 20,
  },

  vazio: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  vazioTexto: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },

  vazioSub: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  lista: {
    gap: 10,
  },

  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },

  itemDescricao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },

  itemCoordenadas: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 2,
  },

  itemPrecisao: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },

  itemData: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },

  itemAcoes: {
    alignItems: 'flex-end',
    gap: 8,
  },

  sincronizadoTag: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600',
  },

  pendenteSyncTag: {
    fontSize: 11,
    color: '#e65100',
    fontWeight: '600',
  },

  btnDeletar: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnDeletarTexto: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 14,
    textAlign: 'center',
  },

  modalCoordenadas: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 4,
  },

  modalCoordenadaTexto: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'monospace',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1f2937',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 18,
  },

  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
  },

  btnCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },

  btnCancelarTexto: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },

  btnSalvar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2e7d32',
  },

  btnSalvarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
