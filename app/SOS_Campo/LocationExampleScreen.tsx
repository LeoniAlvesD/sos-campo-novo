import React, { useEffect, useState } from 'react';
import { useLocationDatabase } from './path/to/useLocationDatabase';
import { useLocationTracking } from './path/to/useLocationTracking';

const LocationExampleScreen = () => {
    const [locations, setLocations] = useState([]);
    const { addLocation, getLocationHistory } = useLocationDatabase();
    const { startTracking, stopTracking, currentLocation } = useLocationTracking();

    useEffect(() => {
        // Fetch location history when component mounts
        const fetchLocations = async () => {
            const history = await getLocationHistory();
            setLocations(history);
        };
        fetchLocations();

        // Start tracking the location
        startTracking();

        // Stop tracking on unmount
        return () => stopTracking();
    }, [getLocationHistory, startTracking, stopTracking]);

    const handleSaveLocation = () => {
        if (currentLocation) {
            addLocation(currentLocation);
        }
    };

    return (
        <div>
            <h1>Offline Location Marking Example</h1>
            <button onClick={handleSaveLocation}>Save Current Location</button>
            <h2>Location History</h2>
            <ul>
                {locations.map((location, index) => (
                    <li key={index}>{`Latitude: ${location.lat}, Longitude: ${location.lng}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default LocationExampleScreen;
