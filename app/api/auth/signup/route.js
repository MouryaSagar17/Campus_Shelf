import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { hashPassword, signJwt, TOKEN_COOKIE } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { name, email, password, college, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    const exists = await User.findOne({ email }).lean()
    if (exists) return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 409 })

    const user = await User.create({ name, email, passwordHash: hashPassword(password), college, phone, emailVerified: true })

    const token = signJwt({ sub: user._id, email: user.email, name: user.name })
    const res = NextResponse.json({ ok: true, data: { id: user._id, name: user.name, email: user.email, college: user.college, phone: user.phone } })
    res.cookies.set(TOKEN_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}




