import React, { useEffect, useMemo, useState } from 'react'

const routes = {
  '/': { title: 'Home' },
  '/about': { title: 'About' },
  '/pricing': { title: 'Pricing' },
  '/legal/privacy': { title: 'Privacy' },
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
  }

  return { path, navigate }
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
  const ct = res.headers.get('content-type') || ''
  const isJson = ct.includes('application/json')
  const data = isJson ? await res.json() : { ok: false, error: 'non-json response', text: await res.text() }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  return data
}

export default function App() {
  const { path, navigate } = usePath()
  const route = routes[path] || null

  const [api, setApi] = useState({ loading: true, ok: false })
  const [err, setErr] = useState('')

  const viteMessage = import.meta.env.VITE_PUBLIC_MESSAGE || ''

  useEffect(() => {
    let cancelled = false
    setApi({ loading: true, ok: false })
    setErr('')
    fetchJson('/api/hello')
      .then((data) => { if (!cancelled) setApi({ loading: false, ok: true, data }) })
      .catch((e) => { if (!cancelled) { setApi({ loading: false, ok: false }); setErr(e?.message || String(e)) } })
    return () => { cancelled = true }
  }, [path])

  const buildStamp = useMemo(() => new Date().toISOString(), [])

  return (
    <div className="page">
      <header className="top">
        <div className="brand" role="banner">
          <img className="logo" src="/assets/logo.svg" alt="Logo" />
          <div className="brandText">
            <div className="brandTitle">ZipShip Hard Mode</div>
            <div className="brandSub">Build + SPA + API + Env</div>
          </div>
        </div>

        <nav className="nav" aria-label="Navigation">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }} className={path==='/'?'active':''}>Home</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }} className={path==='/about'?'active':''}>About</a>
          <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing') }} className={path==='/pricing'?'active':''}>Pricing</a>
          <a href="/legal/privacy" onClick={(e) => { e.preventDefault(); navigate('/legal/privacy') }} className={path==='/legal/privacy'?'active':''}>Privacy</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <img className="heroImg" src="/assets/hero.svg" alt="Hero" />
          <div className="heroOverlay">
            <div className="pill">Deploy Stress-Test</div>
            <h1>Ein Repo, zwei Welten</h1>
            <p>
              Dieses Projekt testet die üblichen Stolpersteine: <strong>Build Output</strong> (<code>dist/</code>),
              <strong> SPA-Routing</strong> (Fallback), <strong>Serverless API</strong> (<code>/api/hello</code>),
              und <strong>Env Vars</strong> (Vite + Functions).
            </p>
            <div className="row">
              <button className="btn" onClick={() => window.location.reload()}>Refresh</button>
              <a className="btn ghost" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </section>

        <section className="grid">
          <article className="card">
            <h2>SPA Route</h2>
            <p>
              Aktuelle Route: <code>{path}</code> {route ? '' : '(unbekannt)'}.
              Das funktioniert nur, wenn Deploy korrekt auf <code>index.html</code> fallbackt.
            </p>
            <div className="hint">Teste direkt: /about, /pricing, /legal/privacy (Reload auf der URL!)</div>
          </article>

          <article className="card">
            <h2>API Check</h2>
            {api.loading ? (
              <p>Lade <code>/api/hello</code> …</p>
            ) : api.ok ? (
              <>
                <p className="ok">✅ API antwortet.</p>
                <pre className="pre">{JSON.stringify(api.data, null, 2)}</pre>
              </>
            ) : (
              <>
                <p className="bad">❌ API Fehler: <code>{err}</code></p>
                <p className="hint">
                  Netlify: <code>/api/*</code> → <code>/.netlify/functions/*</code>.
                  Vercel: <code>/api</code> darf nicht vom SPA-Fallback gekapert werden.
                </p>
              </>
            )}
          </article>

          <article className="card">
            <h2>Env Vars</h2>
            <p>
              Vite: <code>VITE_PUBLIC_MESSAGE</code> = <code>{viteMessage || '(nicht gesetzt)'}</code>
            </p>
            <p className="hint">
              Setze <code>VITE_PUBLIC_MESSAGE</code> (Build Env) und <code>SECRET_TOKEN</code> (Runtime Env) in Vercel/Netlify und redeploy.
            </p>
          </article>
        </section>

        <section className="footer">
          <span>Build: <code>{buildStamp}</code></span>
          <span className="dot">•</span>
          <span>Assets: <code>/assets/*</code></span>
          <span className="dot">•</span>
          <span>API: <code>/api/hello</code></span>
        </section>
      </main>
    </div>
  )
}
