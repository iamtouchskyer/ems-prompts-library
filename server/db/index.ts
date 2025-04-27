
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('database.sqlite');

// Initialize database with schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

export default db;
