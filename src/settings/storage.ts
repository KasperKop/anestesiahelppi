import { openDatabaseAsync } from 'expo-sqlite';
import { decodeSettings, Settings } from './model';
let database: ReturnType<typeof openDatabaseAsync> | undefined;
async function db() {
  database ??= openDatabaseAsync('anestesiahelppi-settings.db')
    .then(async (connection) => {
      await connection.execAsync(
        'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK(id = 1), payload TEXT NOT NULL)',
      );
      return connection;
    })
    .catch((error) => {
      database = undefined;
      throw error;
    });
  return database;
}
export async function readSettings() {
  const row = await (
    await db()
  ).getFirstAsync<{ payload: string }>(
    'SELECT payload FROM settings WHERE id = 1',
  );
  return decodeSettings(row?.payload ?? null);
}
export async function writeSettings(settings: Settings) {
  await (
    await db()
  ).runAsync(
    'INSERT INTO settings (id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
    JSON.stringify(settings),
  );
}
