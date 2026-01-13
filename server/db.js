import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'data.json');

const adapter = new JSONFile(file);
const defaultData = { polls: [] };
const db = new Low(adapter, defaultData);

// Initialize DB
await db.read();
db.data ||= defaultData;
await db.write();

export { db };
