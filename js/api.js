/*
  API.JS
  ------
  Thin client for the accounts + save-progress backend (see /server).
  The game is fully playable without this ever being called — if no
  backend is reachable, everything just stays in localStorage (guest
  mode). This file only handles: signup, login, fetching progress,
  and pushing progress.

  Configure API_BASE for your deployment. Left as localhost:4000 for
  local development against the included server.
*/

const API_BASE = window.CODECRUSH_API_BASE || 'http://localhost:4000';
const TOKEN_KEY = 'codecrush_token';
const USERNAME_KEY = 'codecrush_username';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function getUsername() { return localStorage.getItem(USERNAME_KEY); }

function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

async function apiRequest(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
      ...(options.headers || {})
    }
  });
  let body = null;
  try { body = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) {
    throw new Error((body && body.error) || `Request failed (${res.status})`);
  }
  return body;
}

async function apiSignup(username, password) {
  const data = await apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  setSession(data.token, data.username);
  return data;
}

async function apiLogin(username, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  setSession(data.token, data.username);
  return data;
}

async function apiFetchProgress() {
  const data = await apiRequest('/api/progress');
  return data.save; // null if this account has no saved progress yet
}

async function apiSaveProgress(saveObject) {
  return apiRequest('/api/progress', {
    method: 'PUT',
    body: JSON.stringify({ save: saveObject })
  });
}

if (typeof module !== 'undefined') {
  module.exports = { getToken, getUsername, setSession, clearSession, apiSignup, apiLogin, apiFetchProgress, apiSaveProgress };
}
