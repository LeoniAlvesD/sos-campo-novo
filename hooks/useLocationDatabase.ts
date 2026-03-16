import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'locations.db';

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
        'name TEXT NOT NULL, ' +
        'latitude REAL NOT NULL, ' +
        'longitude REAL NOT NULL);'
      );
    }
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    throw error;
  }
};

const insertLocation = async (name: string, latitude: number, longitude: number) => {
  try {
    const database = await initDatabase();
    if (database) {
      await database.runAsync(
        'INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)',
        [name, latitude, longitude]
      );
    }
  } catch (error) {
    console.error('Erro ao inserir localização:', error);
    throw error;
  }
};

const getLocations = async (): Promise<any[]> => {
  try {
    const database = await initDatabase();
    if (database) {
      const result = await database.getAllAsync<any>('SELECT * FROM locations');
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

export { createTable, insertLocation, getLocations, deleteLocation };
