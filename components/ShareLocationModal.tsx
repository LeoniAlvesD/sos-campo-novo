import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  generateCoordsText,
  generateEmailUri,
  generateGoogleMapsUrl,
  generateShareMessage,
  generateSMSMessage,
  generateWazeFallbackUrl,
  generateWazeUrl,
  generateWhatsAppMessage,
} from '@/utils/locationSharing';

interface ShareLocationModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
}

export default function ShareLocationModal({
  visible,
  latitude,
  longitude,
  onClose,
}: ShareLocationModalProps) {
  const openUrl = async (url: string, fallbackUrl?: string) => {
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url).catch(() => fallbackUrl && Linking.openURL(fallbackUrl));
    } else if (fallbackUrl) {
      Linking.openURL(fallbackUrl).catch(() =>
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo.')
      );
    } else {
      Alert.alert('Erro', 'Aplicativo não disponível neste dispositivo.');
    }
  };

  const handleCopyCoords = async () => {
    const text = generateCoordsText(latitude, longitude);
    await Clipboard.setStringAsync(text);
    onClose();
    Alert.alert('Copiado!', `Coordenadas copiadas:\n${text}`);
  };

  const handleNativeShare = async () => {
    const message = generateShareMessage(latitude, longitude);
    const mapsUrl = generateGoogleMapsUrl(latitude, longitude);
    try {
      await Share.share({ message, url: mapsUrl });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar a localização.');
    }
    onClose();
  };

  const options: {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    onPress: () => void;
  }[] = [
    {
      label: 'Google Maps',
      icon: 'map',
      color: '#4285F4',
      onPress: () => { openUrl(generateGoogleMapsUrl(latitude, longitude)); onClose(); },
    },
    {
      label: 'Waze',
      icon: 'navigate',
      color: '#33CCFF',
      onPress: () => { openUrl(generateWazeUrl(latitude, longitude), generateWazeFallbackUrl(latitude, longitude)); onClose(); },
    },
    {
      label: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => { openUrl(generateWhatsAppMessage(latitude, longitude)); onClose(); },
    },
    {
      label: 'SMS',
      icon: 'chatbubble',
      color: '#FF9800',
      onPress: () => { openUrl(generateSMSMessage(latitude, longitude)); onClose(); },
    },
    {
      label: 'Email',
      icon: 'mail',
      color: '#EA4335',
      onPress: () => { openUrl(generateEmailUri(latitude, longitude)); onClose(); },
    },
    {
      label: 'Copiar',
      icon: 'copy',
      color: '#607D8B',
      onPress: handleCopyCoords,
    },
    {
      label: 'Compartilhar',
      icon: 'share-social',
      color: '#1f7a3f',
      onPress: handleNativeShare,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => { /* Prevents touch from propagating to the backdrop */ }}>
          <View style={styles.handle} />
          <Text style={styles.title}>Compartilhar Localização</Text>
          <Text style={styles.coords}>
            {generateCoordsText(latitude, longitude)}
          </Text>

          <View style={styles.grid}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.option}
                onPress={opt.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: opt.color }]}>
                  <Ionicons name={opt.icon} size={26} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  coords: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  option: {
    width: 80,
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
});

