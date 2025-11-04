import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { verifyPassword, signJwt, TOKEN_COOKIE } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 })

    const user = await User.findOne({ email })
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const token = signJwt({ sub: user._id, email: user.email, name: user.name })
    const res = NextResponse.json({ ok: true, data: { id: user._id, name: user.name, email: user.email, college: user.college, phone: user.phone } })
    res.cookies.set(TOKEN_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}




