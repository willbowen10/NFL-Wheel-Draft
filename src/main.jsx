import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ── Storage shim: replaces window.storage (Claude artifact API) with localStorage ──
// Shared storage uses a fixed prefix so all users on the same deploy share data.
// For true cross-device shared leaderboard, swap this out for a Firebase/Supabase call.
window.storage = {
  async get(key, shared = false) {
    const k = shared ? `__shared__${key}` : key;
    const val = localStorage.getItem(k);
    return val !== null ? { key, value: val, shared } : null;
  },
  async set(key, value, shared = false) {
    const k = shared ? `__shared__${key}` : key;
    localStorage.setItem(k, value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    const k = shared ? `__shared__${key}` : key;
    localStorage.removeItem(k);
    return { key, deleted: true, shared };
  },
  async list(prefix = '', shared = false) {
    const fullPrefix = shared ? `__shared__${prefix}` : prefix;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(fullPrefix)) {
        // strip the __shared__ prefix back off before returning
        keys.push(shared ? k.replace('__shared__', '') : k);
      }
    }
    return { keys, prefix, shared };
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
