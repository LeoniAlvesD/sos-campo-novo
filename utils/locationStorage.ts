import * as SQLite from 'expo-sqlite';

export interface LocationRecord {
  id: number;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  descricao: string;
  timestamp: number;
  sincronizado: number; // 0 = não sincronizado, 1 = sincronizado
}

const DB_NAME = 'localizacoes.db';

export async function abrirBanco(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS localizacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL,
      descricao TEXT DEFAULT '',
      timestamp INTEGER NOT NULL,
      sincronizado INTEGER DEFAULT 0
    );
  `);
  return db;
}

export async function salvarLocalizacao(
  db: SQLite.SQLiteDatabase,
  latitude: number,
  longitude: number,
  accuracy: number | null,
  descricao: string = ''
): Promise<number> {
  const timestamp = Date.now();
  const result = await db.runAsync(
    'INSERT INTO localizacoes (latitude, longitude, accuracy, descricao, timestamp, sincronizado) VALUES (?, ?, ?, ?, ?, 0)',
    [latitude, longitude, accuracy ?? null, descricao, timestamp]
  );
  return result.lastInsertRowId;
}

export async function listarLocalizacoes(
  db: SQLite.SQLiteDatabase
): Promise<LocationRecord[]> {
  const rows = await db.getAllAsync<LocationRecord>(
    'SELECT * FROM localizacoes ORDER BY timestamp DESC'
  );
  return rows;
}

export async function deletarLocalizacao(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM localizacoes WHERE id = ?', [id]);
}

export async function marcarSincronizado(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('UPDATE localizacoes SET sincronizado = 1 WHERE id = ?', [id]);
}

export async function listarNaoSincronizados(
  db: SQLite.SQLiteDatabase
): Promise<LocationRecord[]> {
  const rows = await db.getAllAsync<LocationRecord>(
    'SELECT * FROM localizacoes WHERE sincronizado = 0 ORDER BY timestamp ASC'
  );
  return rows;
}

export function formatarData(timestamp: number): string {
  const data = new Date(timestamp);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
