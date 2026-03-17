/**
 * ShareLocationModal – bottom-sheet modal with extended location sharing options.
 *
 * Provides quick-access buttons for Google Maps, Waze, WhatsApp, SMS, email,
 * clipboard copy, and native share sheet.
 *
 * Usage example:
 * ```tsx
 * <ShareLocationModal
 *   visible={modalVisible}
 *   latitude={coords.latitude}
 *   longitude={coords.longitude}
 *   accuracy={coords.accuracy}
 *   onClose={() => setModalVisible(false)}
 * />
 * ```
 *
 * This component is ready to use but not yet wired to any screen.
 * Wire it to the Localização or Emergência screen when richer sharing
 * options are needed.
 */
import {
    copyCoordinatesToClipboard,
    nativeShare,
    openGoogleMaps,
    openWaze,
    shareViaEmail,
    shareViaSMS,
    shareViaWhatsApp,
} from '@/utils/locationSharing';
import React from 'react';
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ShareLocationModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  accuracy?: number;
  onClose: () => void;
}

export default function ShareLocationModal({
  visible,
  latitude,
  longitude,
  accuracy,
  onClose,
}: ShareLocationModalProps) {
  const handleCopy = async () => {
    const success = await copyCoordinatesToClipboard(latitude, longitude);
    if (success) {
      Alert.alert('Sucesso', `Coordenadas copiadas!\n${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
    onClose();
  };

  const handleOpenMaps = () => {
    openGoogleMaps(latitude, longitude);
    onClose();
  };

  const handleOpenWaze = () => {
    openWaze(latitude, longitude);
    onClose();
  };

  const handleWhatsApp = async () => {
    await shareViaWhatsApp(latitude, longitude);
    onClose();
  };

  const handleSMS = async () => {
    await shareViaSMS(latitude, longitude);
    onClose();
  };

  const handleEmail = async () => {
    await shareViaEmail(latitude, longitude, accuracy);
    onClose();
  };

  const handleNativeShare = async () => {
    await nativeShare(latitude, longitude);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Compartilhar Localização</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={[styles.button, styles.maps]} onPress={handleOpenMaps}>
              <Text style={styles.emoji}>🗺️</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>Google Maps</Text>
                <Text style={styles.buttonSubtitle}>Abrir no mapa</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.waze]} onPress={handleOpenWaze}>
              <Text style={styles.emoji}>🧭</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>Waze</Text>
                <Text style={styles.buttonSubtitle}>Navegação</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.whatsapp]} onPress={handleWhatsApp}>
              <Text style={styles.emoji}>💬</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>WhatsApp</Text>
                <Text style={styles.buttonSubtitle}>Enviar mensagem</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.sms]} onPress={handleSMS}>
              <Text style={styles.emoji}>📱</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>SMS</Text>
                <Text style={styles.buttonSubtitle}>Enviar texto</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.email]} onPress={handleEmail}>
              <Text style={styles.emoji}>📧</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>Email</Text>
                <Text style={styles.buttonSubtitle}>Enviar por email</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.copy]} onPress={handleCopy}>
              <Text style={styles.emoji}>📋</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>Copiar</Text>
                <Text style={styles.buttonSubtitle}>Coordenadas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.share]} onPress={handleNativeShare}>
              <Text style={styles.emoji}>↗️</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>Compartilhar</Text>
                <Text style={styles.buttonSubtitle}>Mais opções</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#6b7280',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  buttonSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  maps: {
    backgroundColor: '#e8f4f8',
  },
  waze: {
    backgroundColor: '#f0f8ff',
  },
  whatsapp: {
    backgroundColor: '#e8f5e9',
  },
  sms: {
    backgroundColor: '#fff3e0',
  },
  email: {
    backgroundColor: '#f3e5f5',
  },
  copy: {
    backgroundColor: '#e3f2fd',
  },
  share: {
    backgroundColor: '#fce4ec',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 14,
    backgroundColor: '#1f7a3f',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});