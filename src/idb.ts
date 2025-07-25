import { openDB } from 'idb';

const dbName = 'pokeCache';
const storeNames = [
  'pokemon',
  'moves',
  'abilities'
];
const EXPIRY_TIME = 5 * 60 * 1000;

// Open the IndexedDB and create the store
async function openDb() {
  return openDB(dbName, 1, {
    upgrade(db) {
      for (const storeName of storeNames) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'name' });
          store.createIndex('by_name', 'name'); // Index for fast lookup by name
        }
      }
    },
  });
}

// Save to pokeCache.moves
async function saveToDb(storeName: string, name: string, data: any) {
  const db = await openDb();
  await db.put(storeName, { 
    name: name, 
    details: data, 
    timestamp: Date.now() 
  });
}

// Check if item is expired
function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > EXPIRY_TIME
}

// Get and validate expiration
async function getFromDbWithExpiryCheck(storeName: string, name: string) {
  const db = await openDb();
  const record = await db.get(storeName, name);

  if (!record || record == undefined) {
    return null;
  }
  
  if (isExpired(record.timestamp)) {
    await db.delete(storeName, name); // clean up expired item
    return null;
  }
  return record;
}

// Get a pokemon from pokeCache
async function getPokemonFromDb(name: string) {
  const pokemon = await getFromDbWithExpiryCheck('pokemon', name);
  return pokemon ? pokemon.details : null;
}

// Get a move from pokeCache
async function getMoveFromDb(name: string) {
  const move = await getFromDbWithExpiryCheck('moves', name);
  return move ? move.details : null;
}

// Get an ability from pokeCache
async function getAbilityFromDb(name: string) {
  const ability = await getFromDbWithExpiryCheck('abilities', name);
  return ability ? ability.details : null;
}

// Clear the entire store (useful for clearing cache)
async function clearCache() {
  const db = await openDb();
  for (const storeName of storeNames) {
    await db.clear(storeName);
  }
}

export { saveToDb, getPokemonFromDb, getMoveFromDb, getAbilityFromDb, clearCache };
