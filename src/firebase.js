import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue, off, push, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuEEA49Fm1ti-5jRBuDpDkZBVLjsork_Q",
  authDomain: "nfl-wheel.firebaseapp.com",
  databaseURL: "https://nfl-wheel-default-rtdb.firebaseio.com",
  projectId: "nfl-wheel",
  storageBucket: "nfl-wheel.firebasestorage.app",
  messagingSenderId: "355105467169",
  appId: "1:355105467169:web:d022be621da2fbbf222c60",
  measurementId: "G-S0TNVJEZNP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── room code generator ──────────────────────────────────────────────────────
export const genCode = () => Math.random().toString(36).slice(2,8).toUpperCase();

// ── create a new online room ─────────────────────────────────────────────────
export const createRoom = async (code, hostName, mode, maxPlayers) => {
  const roomRef = ref(db, `rooms/${code}`);
  await set(roomRef, {
    status: "waiting",
    mode,           // "draft" | "blitz"
    maxPlayers,
    turn: "p0",
    snakeDir: 1,    // for draft mode snake order
    createdAt: serverTimestamp(),
    players: {
      p0: { name: hostName, roster: {QB:null,RB:null,WR1:null,WR2:null,WR3:null,TE:null,DEF:null,HC:null}, legendTokens:2, reSpinUsed:false, done:false }
    },
    claimed: {}
  });
};

// ── join an existing room ────────────────────────────────────────────────────
export const joinRoom = async (code, playerName) => {
  const roomRef = ref(db, `rooms/${code}`);
  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error("Room not found");
  const room = snap.val();
  if (room.status !== "waiting") throw new Error("Game already started");
  const existingPlayers = Object.keys(room.players || {});
  if (existingPlayers.length >= room.maxPlayers) throw new Error("Room is full");
  const pid = `p${existingPlayers.length}`;
  await update(ref(db, `rooms/${code}/players/${pid}`), {
    name: playerName, 
    roster: {QB:null,RB:null,WR1:null,WR2:null,WR3:null,TE:null,DEF:null,HC:null},
    legendTokens: 2, reSpinUsed: false, done: false
  });
  return pid;
};

// ── start the game (host only) ───────────────────────────────────────────────
export const startGame = async (code) => {
  await update(ref(db, `rooms/${code}`), { status: "active" });
};

// ── listen to a room ─────────────────────────────────────────────────────────
export const subscribeRoom = (code, cb) => {
  const roomRef = ref(db, `rooms/${code}`);
  onValue(roomRef, snap => cb(snap.val()));
  return () => off(roomRef);
};

// ── write a spin result ──────────────────────────────────────────────────────
export const writeSpin = async (code, pid, teamId) => {
  await update(ref(db, `rooms/${code}/players/${pid}`), { spinning: teamId });
};

// ── write a pick ─────────────────────────────────────────────────────────────
export const writePick = async (code, pid, slot, player, isLegend, players, mode, currentTurn, snakeDir, maxPlayers) => {
  const updates = {};
  
  // update player roster
  updates[`rooms/${code}/players/${pid}/roster/${slot}`] = { ...player, isLegend };
  if (isLegend) {
    const cur = players[pid];
    updates[`rooms/${code}/players/${pid}/legendTokens`] = (cur.legendTokens || 2) - 1;
  }
  updates[`rooms/${code}/players/${pid}/spinning`] = null;
  
  // claim player
  if (!isLegend) {
    const claimKey = `${slot}_${player.n}`.replace(/[^a-zA-Z0-9_]/g, "_");
    updates[`rooms/${code}/claimed/${claimKey}`] = pid;
  }

  // check if player is done
  const updatedRoster = { ...players[pid].roster, [slot]: player };
  const playerDone = Object.values(updatedRoster).every(v => v !== null);
  if (playerDone) updates[`rooms/${code}/players/${pid}/done`] = true;

  // advance turn for draft mode
  if (mode === "draft") {
    const pidNums = Array.from({length: maxPlayers}, (_, i) => i);
    const currentIdx = parseInt(currentTurn.slice(1));
    
    // check if all players done after this pick
    const allDoneAfter = pidNums.every(i => {
      if (`p${i}` === pid) return playerDone;
      return players[`p${i}`]?.done;
    });
    
    if (!allDoneAfter) {
      // snake draft: find next player who still has slots
      let nextIdx = currentIdx;
      let dir = snakeDir;
      for (let tries = 0; tries < maxPlayers * 2; tries++) {
        nextIdx += dir;
        if (nextIdx >= maxPlayers) { nextIdx = maxPlayers - 1; dir = -1; }
        if (nextIdx < 0) { nextIdx = 0; dir = 1; }
        const nextPid = `p${nextIdx}`;
        const nextRoster = nextPid === pid ? updatedRoster : players[nextPid]?.roster || {};
        if (Object.values(nextRoster).some(v => v === null)) {
          updates[`rooms/${code}/turn`] = `p${nextIdx}`;
          updates[`rooms/${code}/snakeDir`] = dir;
          break;
        }
      }
    }
  }

  await update(ref(db, "/"), updates);
};

// ── write respin ─────────────────────────────────────────────────────────────
export const writeReSpin = async (code, pid) => {
  await update(ref(db, `rooms/${code}/players/${pid}`), { reSpinUsed: true, spinning: null });
};

// ── cleanup old rooms ────────────────────────────────────────────────────────
export const cleanupRoom = async (code) => {
  await set(ref(db, `rooms/${code}`), null);
};
