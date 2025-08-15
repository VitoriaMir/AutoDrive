// Minimal fetch wrapper to add Firebase ID token in Authorization header
import { auth } from './firebase-init.js';

export async function apiFetch(url, options = {}) {
  const user = auth.currentUser;
  let token = null;
  if (user) token = await user.getIdToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return resp.json();
}
