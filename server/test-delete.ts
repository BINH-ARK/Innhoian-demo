#!/usr/bin/env node

// Test DELETE operation directly with better-sqlite3
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", ".local", "db.sqlite");

console.log(`Database path: ${dbPath}`);

const db = new Database(dbPath);

// Check if room exists before delete
const roomId = 6;
console.log(`\nChecking room ${roomId} before delete:`);
const roomBefore = db.prepare("SELECT * FROM rooms WHERE id = ?").get(roomId);
console.log(roomBefore);

// Perform DELETE
console.log(`\nDeleting room ${roomId}...`);
const stmt = db.prepare("DELETE FROM rooms WHERE id = ?");
const result = stmt.run(roomId);

console.log(`\nDELETE result:`);
console.log(`- Changes: ${result.changes}`);
console.log(`- Last Insert Row ID: ${result.lastInsertRowid}`);

// Check if room exists after delete
console.log(`\nChecking room ${roomId} after delete:`);
const roomAfter = db.prepare("SELECT * FROM rooms WHERE id = ?").get(roomId);
console.log(roomAfter || "Room not found (deleted successfully)");

// List all rooms
console.log(`\nAll rooms after delete:`);
const allRooms = db.prepare("SELECT id, name FROM rooms").all();
console.log(allRooms);

db.close();
