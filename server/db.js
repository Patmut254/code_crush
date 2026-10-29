// db.js — SQLite storage for accounts + saved progress.
//
// Swapping databases later: every query in this file goes through the
// small wrapper functions at the bottom (getUserByUsername, createUser,
// getProgress, upsertProgress). To move to Postgres/MySQL/Supabase in
// production, only this file needs to change — server.js and the
// frontend never touch SQL directly.

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'codecrush.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    save_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function getUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function createUser(username, passwordHash) {
  const info = db
    .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
    .run(username, passwordHash);
  return getUserById(info.lastInsertRowid);
}

function getProgress(userId) {
  const row = db.prepare('SELECT save_json FROM progress WHERE user_id = ?').get(userId);
  return row ? JSON.parse(row.save_json) : null;
}

function upsertProgress(userId, saveObject) {
  const json = JSON.stringify(saveObject);
  db.prepare(
    `INSERT INTO progress (user_id, save_json, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET save_json = excluded.save_json, updated_at = datetime('now')`
  ).run(userId, json);
}

module.exports = { getUserByUsername, getUserById, createUser, getProgress, upsertProgress };
