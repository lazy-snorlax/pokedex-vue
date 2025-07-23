import { openDB } from 'idb';

const dbName = 'pokeCache';
const storeName = 'moves';

// Open the IndexedDB and create the store
async function openDb() {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'name' });
        store.createIndex('by_name', 'name'); // Index for fast lookup by move name
      }
    },
  });
}

// Save a move to IndexedDB
async function saveMoveToDb(moveName: string, moveDetails: any) {
  const db = await openDb();
  await db.put(storeName, { name: moveName, details: moveDetails });
}

// Get a move from IndexedDB
async function getMoveFromDb(moveName: string) {
  const db = await openDb();
  const move = await db.get(storeName, moveName);
  return move ? move.details : null;
}

// Clear the entire store (useful for clearing cache)
async function clearMovesCache() {
  const db = await openDb();
  await db.clear(storeName);
}

export { saveMoveToDb, getMoveFromDb, clearMovesCache };
