exports.handler = async function (event, context) {
  const secret = process.env.SECRET_TOKEN ? 'present' : 'missing'
  const msg = process.env.VITE_PUBLIC_MESSAGE || ''
  const now = new Date().toISOString()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      platform: 'netlify',
      route: event.path,
      secret_token: secret,
      vite_public_message_seen_by_function: msg || '(not set)',
      now
    })
  }
}
