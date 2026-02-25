# 🏈 NFL Wheel Draft

Spin for teams. Draft legends. Build the ultimate franchise.

## Deploy to Vercel (5 minutes)

### Option A — Drag & Drop (no account needed for preview)
1. Run `npm install && npm run build` locally
2. Drag the `dist/` folder to **vercel.com/new**

### Option B — GitHub + Vercel (recommended, gets you a permanent URL)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo at github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/nfl-wheel-draft.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) → "Add New Project"
   - Import your GitHub repo
   - Framework: **Vite** (auto-detected)
   - Click **Deploy** — done in ~60 seconds

3. **Your app is live** at `https://nfl-wheel-draft.vercel.app` (or similar)

## Run Locally

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Notes

- **Leaderboard**: Currently uses localStorage (scores saved per-browser). For a true shared leaderboard across all players, swap the storage shim in `src/main.jsx` for a Firebase Realtime Database or Supabase call.
- **PWA**: The `manifest.json` enables "Add to Home Screen" on mobile Safari/Chrome — users get an app icon without the App Store.
- **App Store**: To publish natively, use [Capacitor](https://capacitorjs.com) to wrap this into an iOS/Android binary.
