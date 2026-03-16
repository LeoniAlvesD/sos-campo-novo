import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LocationMarkerProps {
  location: string;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ location, onClick }) => {
  return (
    <View style={styles.marker}>
      <Text style={styles.title}>{location}</Text>
      <TouchableOpacity style={styles.button} onPress={onClick}>
        <Text style={styles.buttonText}>Ver Localização</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LocationMarker;
