import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveLocation(location: { latitude: number; longitude: number }): Promise<void> {
  try {
    const jsonValue = JSON.stringify(location);
    await AsyncStorage.setItem('@location', jsonValue);
  } catch (e) {
    console.error('Erro ao salvar localização:', e);
  }
}

async function getLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const jsonValue = await AsyncStorage.getItem('@location');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao obter localização:', e);
    return null;
  }
}

async function removeLocation(): Promise<void> {
  try {
    await AsyncStorage.removeItem('@location');
  } catch (e) {
    console.error('Erro ao remover localização:', e);
  }
}

export { saveLocation, getLocation, removeLocation };
