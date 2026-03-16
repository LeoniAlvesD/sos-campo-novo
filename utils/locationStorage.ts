import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions for location storage.
 */

async function saveLocation(location: { latitude: number; longitude: number }): Promise<void> {
    await AsyncStorage.setItem('currentLocation', JSON.stringify(location));
}

async function getLocation(): Promise<{ latitude: number; longitude: number } | null> {
    const location = await AsyncStorage.getItem('currentLocation');
    return location ? JSON.parse(location) : null;
}

export { saveLocation, getLocation };
