import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue, off, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuEEA49Fm1ti-5jRBuDpDkZBVLjsork_Q",
  authDomain: "nfl-wheel.firebaseapp.com",
  databaseURL: "https://nfl-wheel-default-rtdb.firebaseio.com",
  projectId: "nfl-wheel",
  storageBucket: "nfl-wheel.firebasestorage.app",
  messagingSenderId: "355105467169",
  appId: "1:355105467169:web:d022be621da2fbbf222c60",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const EMPTY_ROSTER = {QB:"",RB:"",WR1:"",WR2:"",WR3:"",TE:"",DEF:"",HC:""};
const SLOT_KEYS = ["QB","RB","WR1","WR2","WR3","TE","DEF","HC"];
const isFilledSlot = v => v && typeof v === "object";
const rosterDone = roster => SLOT_KEYS.filter(k => isFilledSlot(roster?.[k])).length === 8;

export const genCode = () => Math.random().toString(36).slice(2,8).toUpperCase();

export const createRoom = async (code, hostName, mode, maxPlayers) => {
  await set(ref(db, `rooms/${code}`), {
    status: "waiting", mode, maxPlayers, turn: "p0", snakeDir: 1,
    createdAt: serverTimestamp(),
    players: { p0: { name: hostName, roster: {...EMPTY_ROSTER}, legendTokens:2, reSpinUsed:false, done:false } },
    claimed: { _init: true }
  });
};

export const joinRoom = async (code, playerName) => {
  const snap = await get(ref(db, `rooms/${code}`));
  if (!snap.exists()) throw new Error("Room not found");
  const room = snap.val();
  if (room.status !== "waiting") throw new Error("Game already started");
  const existing = Object.keys(room.players || {});
  if (existing.length >= room.maxPlayers) throw new Error("Room is full");
  const pid = `p${existing.length}`;
  await update(ref(db, `rooms/${code}/players/${pid}`), {
    name: playerName, roster: {...EMPTY_ROSTER}, legendTokens:2, reSpinUsed:false, done:false
  });
  return pid;
};

export const startGame = async (code) => {
  await update(ref(db, `rooms/${code}`), { status: "active" });
};

export const subscribeRoom = (code, cb) => {
  const r = ref(db, `rooms/${code}`);
  onValue(r, snap => cb(snap.val()));
  return () => off(r);
};

export const writeSpin = async (code, pid, teamId) => {
  await update(ref(db, `rooms/${code}/players/${pid}`), { spinning: teamId });
};

export const writeReSpin = async (code, pid) => {
  await update(ref(db, `rooms/${code}/players/${pid}`), { reSpinUsed: true, spinning: null });
};

export const writePick = async (code, pid, slot, player, isLegend, players, mode, currentTurn, snakeDir, maxPlayers) => {
  const updates = {};
  updates[`rooms/${code}/players/${pid}/roster/${slot}`] = { ...player, isLegend };
  updates[`rooms/${code}/players/${pid}/spinning`] = null;
  if (isLegend) {
    updates[`rooms/${code}/players/${pid}/legendTokens`] = (players[pid]?.legendTokens ?? 2) - 1;
  } else {
    const claimKey = `${slot}_${player.n}`.replace(/[^a-zA-Z0-9_]/g, "_");
    updates[`rooms/${code}/claimed/${claimKey}`] = pid;
  }
  const updatedRoster = { ...(players[pid]?.roster || {}), [slot]: { ...player, isLegend } };
  const playerDone = rosterDone(updatedRoster);
  if (playerDone) updates[`rooms/${code}/players/${pid}/done`] = true;

  if (mode === "draft") {
    const currentIdx = parseInt(currentTurn.replace("p",""));
    let dir = snakeDir; let nextIdx = currentIdx;
    for (let tries = 0; tries < maxPlayers * 3; tries++) {
      nextIdx += dir;
      if (nextIdx >= maxPlayers) { nextIdx = maxPlayers-1; dir = -1; }
      if (nextIdx < 0) { nextIdx = 0; dir = 1; }
      const nPid = `p${nextIdx}`;
      const nRoster = nPid === pid ? updatedRoster : (players[nPid]?.roster || {});
      if (!rosterDone(nRoster)) { updates[`rooms/${code}/turn`] = nPid; updates[`rooms/${code}/snakeDir`] = dir; break; }
    }
  }

  // Write picks first, then verify all done from fresh DB read
  await update(ref(db, "/"), updates);

  // Re-read fresh data to check allDone (avoids stale local state)
  if (playerDone) {
    const snap = await get(ref(db, `rooms/${code}/players`));
    const freshPlayers = snap.val() || {};
    const allDone = Array.from({length: maxPlayers}, (_,i) => `p${i}`).every(p => {
      if (p === pid) return true; // we just set done=true above
      return freshPlayers[p]?.done === true;
    });
    if (allDone) {
      await update(ref(db, `rooms/${code}`), { status: "complete" });
    }
  }
};

export const resetRoom = async (code, currentPlayers) => {
  const updates = {};
  updates[`rooms/${code}/status`] = "active";
  updates[`rooms/${code}/turn`] = "p0";
  updates[`rooms/${code}/snakeDir`] = 1;
  updates[`rooms/${code}/claimed`] = { _init: true };
  Object.keys(currentPlayers).forEach(pid => {
    updates[`rooms/${code}/players/${pid}/roster`] = {...EMPTY_ROSTER};
    updates[`rooms/${code}/players/${pid}/legendTokens`] = 2;
    updates[`rooms/${code}/players/${pid}/reSpinUsed`] = false;
    updates[`rooms/${code}/players/${pid}/done`] = false;
    updates[`rooms/${code}/players/${pid}/spinning`] = null;
  });
  await update(ref(db, "/"), updates);
};

export const cleanupRoom = async (code) => {
  await set(ref(db, `rooms/${code}`), null);
};
