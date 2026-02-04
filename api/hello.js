export default function handler(req, res) {
  const secret = process.env.SECRET_TOKEN ? 'present' : 'missing'
  const msg = process.env.VITE_PUBLIC_MESSAGE || ''
  const now = new Date().toISOString()

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({
    ok: true,
    platform: 'vercel',
    route: req.url,
    secret_token: secret,
    vite_public_message_seen_by_function: msg || '(not set)',
    now
  })
}
