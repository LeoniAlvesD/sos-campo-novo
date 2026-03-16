import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'sos_campo.db';

let db: SQLite.SQLiteDatabase | null = null;

const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return db;
};

const createTable = async () => {
  try {
    const database = await initDatabase();
    if (database) {
      await database.execAsync(
        'CREATE TABLE IF NOT EXISTS locations (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'latitude REAL NOT NULL, ' +
        'longitude REAL NOT NULL, ' +
        'accuracy REAL, ' +
        'timestamp TEXT NOT NULL);'
      );
    }
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    throw error;
  }
};

const insertLocation = async (
  latitude: number,
  longitude: number,
  accuracy: number | null,
  timestamp: string
) => {
  try {
    const database = await initDatabase();
    if (database) {
      await database.runAsync(
        'INSERT INTO locations (latitude, longitude, accuracy, timestamp) VALUES (?, ?, ?, ?)',
        [latitude, longitude, accuracy, timestamp]
      );
    }
  } catch (error) {
    console.error('Erro ao inserir localização:', error);
    throw error;
  }
};

const getLocations = async (): Promise<{
  id: number;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
}[]> => {
  try {
    const database = await initDatabase();
    if (database) {
      const result = await database.getAllAsync<{
        id: number;
        latitude: number;
        longitude: number;
        accuracy: number | null;
        timestamp: string;
      }>('SELECT * FROM locations ORDER BY timestamp DESC');
      return result || [];
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar localizações:', error);
    return [];
  }
};

const deleteLocation = async (id: number) => {
  try {
    const database = await initDatabase();
    if (database) {
      await database.runAsync('DELETE FROM locations WHERE id = ?', [id]);
    }
  } catch (error) {
    console.error('Erro ao deletar localização:', error);
    throw error;
  }
};

export { createTable, deleteLocation, getLocations, insertLocation };
