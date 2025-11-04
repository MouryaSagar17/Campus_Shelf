import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const TOKEN_COOKIE = 'campusshelf_token'

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64urlJson(obj) {
  return base64url(JSON.stringify(obj))
}

function hmacSHA256(message, secret) {
  return crypto.createHmac('sha256', secret).update(message).digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password, passwordHash) {
  return hashPassword(password) === passwordHash
}

export function signJwt(payload, expiresIn = '7d') {
  const header = { alg: 'HS256', typ: 'JWT' }

  const nowSec = Math.floor(Date.now() / 1000)
  let exp
  if (typeof expiresIn === 'string' && expiresIn.endsWith('d')) {
    const days = parseInt(expiresIn.replace('d', ''), 10) || 7
    exp = nowSec + days * 24 * 60 * 60
  } else if (typeof expiresIn === 'number') {
    exp = nowSec + expiresIn
  } else {
    exp = nowSec + 7 * 24 * 60 * 60
  }

  const body = { ...payload, iat: nowSec, exp }

  const headerB64 = base64urlJson(header)
  const payloadB64 = base64urlJson(body)
  const toSign = `${headerB64}.${payloadB64}`
  const signature = hmacSHA256(toSign, JWT_SECRET)
  return `${toSign}.${signature}`
}

export function verifyJwt(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.')
    if (!headerB64 || !payloadB64 || !signature) return null
    const toSign = `${headerB64}.${payloadB64}`
    const expected = hmacSHA256(toSign, JWT_SECRET)
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    const nowSec = Math.floor(Date.now() / 1000)
    if (payload.exp && nowSec > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export { TOKEN_COOKIE }
