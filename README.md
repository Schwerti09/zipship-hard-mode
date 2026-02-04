# ZipShip Hard Mode (Vercel + Netlify)

**Ziel:** realistischer Deploy-Stress-Test für ZipShip → GitHub → **Vercel & Netlify**.

Das Repo testet:
- ✅ Build Step (Vite → `dist/`)
- ✅ SPA Routing (Deep Links + Reload)
- ✅ API Endpoint `/api/hello`
  - Vercel: `api/hello.js`
  - Netlify: `netlify/functions/hello.js` + Redirect `/api/*`
- ✅ Env Vars
  - Frontend: `VITE_PUBLIC_MESSAGE`
  - Functions: `SECRET_TOKEN`

## Lokal
```bash
npm install
npm run dev
```

## Env Vars (optional)
Setze in Netlify/Vercel:
- `VITE_PUBLIC_MESSAGE` (Build Env)
- `SECRET_TOKEN` (Runtime Env)

Datei: `.env.example`
