import { openDatabaseAsync } from 'expo-sqlite';
import { decodeMemory, MemoryState } from './model';
let database: ReturnType<typeof openDatabaseAsync> | undefined;
async function db() {
  database ??= openDatabaseAsync('anestesiahelppi-memory.db')
    .then(async (connection) => {
      await connection.execAsync(
        'PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS memory_state (id INTEGER PRIMARY KEY CHECK(id = 1), payload TEXT NOT NULL);',
      );
      return connection;
    })
    .catch((error) => {
      database = undefined;
      throw error;
    });
  return database;
}
export async function readMemory() {
  const row = await (
    await db()
  ).getFirstAsync<{ payload: string }>(
    'SELECT payload FROM memory_state WHERE id = 1',
  );
  return decodeMemory(row?.payload ?? null);
}
export async function writeMemory(state: MemoryState) {
  await (
    await db()
  ).runAsync(
    'INSERT INTO memory_state (id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
    JSON.stringify(state),
  );
}
