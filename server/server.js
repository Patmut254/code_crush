// server.js — Code Crush accounts + save API.
//
// Endpoints:
//   POST /api/auth/signup   { username, password } -> { token, username }
//   POST /api/auth/login    { username, password } -> { token, username }
//   GET  /api/progress               (auth)        -> saved progress or null
//   PUT  /api/progress      { save } (auth)         -> saved progress
//
// Run locally:
//   cp .env.example .env   (edit JWT_SECRET before going to production)
//   npm install
//   npm start

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: '256kb' }));

// simple request rate guard against brute-force login/signup spam
const attempts = new Map();
function rateLimit(key, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;
  attempts.set(key, record);
  return record.count <= max;
}

function isValidUsername(u) {
  return typeof u === 'string' && /^[a-zA-Z0-9_]{3,20}$/.test(u);
}
function isValidPassword(p) {
  return typeof p === 'string' && p.length >= 6 && p.length <= 128;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/signup', (req, res) => {
  if (!rateLimit('signup:' + req.ip)) return res.status(429).json({ error: 'Too many attempts, try again soon' });

  const { username, password } = req.body || {};
  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters: letters, numbers, underscore' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (db.getUserByUsername(username)) {
    return res.status(409).json({ error: 'That username is already taken' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser(username, passwordHash);
  const token = signToken(user);
  res.json({ token, username: user.username });
});

app.post('/api/auth/login', (req, res) => {
  if (!rateLimit('login:' + req.ip)) return res.status(429).json({ error: 'Too many attempts, try again soon' });

  const { username, password } = req.body || {};
  const user = db.getUserByUsername(username || '');
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Incorrect username or password' });
  }
  const token = signToken(user);
  res.json({ token, username: user.username });
});

app.get('/api/progress', requireAuth, (req, res) => {
  const saved = db.getProgress(req.user.sub);
  res.json({ save: saved });
});

app.put('/api/progress', requireAuth, (req, res) => {
  const { save } = req.body || {};
  if (!save || typeof save !== 'object') {
    return res.status(400).json({ error: 'Missing save payload' });
  }
  db.upsertProgress(req.user.sub, save);
  res.json({ ok: true });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Code Crush API listening on http://localhost:${PORT}`);
});
