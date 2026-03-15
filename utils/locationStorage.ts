// locationStorage.ts

/**
 * Utility functions for location storage and synchronization.
 */

// Function to save the current location to local storage
function saveLocation(location: { latitude: number; longitude: number }): void {
    localStorage.setItem('currentLocation', JSON.stringify(location));
}

// Function to get the saved location from local storage
function getLocation(): { latitude: number; longitude: number } | null {
    const location = localStorage.getItem('currentLocation');
    return location ? JSON.parse(location) : null;
}

// Function to synchronize location from a server (example)
async function syncLocationFromServer(url: string): Promise<void> {
    const response = await fetch(url);
    const location = await response.json();
    saveLocation(location);
}

// Expose functions
export { saveLocation, getLocation, syncLocationFromServer };