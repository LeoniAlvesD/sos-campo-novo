// useLocationDatabase.ts

import { openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

// Database name
const DATABASE_NAME = 'locations.db';

// Create or open the database
const database: SQLiteDatabase = openDatabase({
  name: DATABASE_NAME,
  location: 'default',
});

// Function to create the locations table
const createTable = async () => {
  await database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS locations (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );'
    );
  });
};

// Function to insert a location
const insertLocation = async (name: string, latitude: number, longitude: number) => {
  await database.transaction(tx => {
    tx.executeSql(
      'INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)',
      [name, latitude, longitude]
    );
  });
};

// Function to get all locations
const getLocations = async () => {
  return new Promise(resolve => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM locations',
        [],
        (_, { rows }) => resolve(rows),
        (_, error) => resolve([])
      );
    });
  });
};

// Function to delete a location
const deleteLocation = async (id: number) => {
  await database.transaction(tx => {
    tx.executeSql(
      'DELETE FROM locations WHERE id = ?',
      [id]
    );
  });
};

export { createTable, insertLocation, getLocations, deleteLocation };