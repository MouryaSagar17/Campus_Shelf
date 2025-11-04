import { NextResponse } from 'next/server'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'

export async function GET(request) {
  const cookie = request.cookies.get(TOKEN_COOKIE)?.value
  const payload = cookie ? verifyJwt(cookie) : null
  if (!payload) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const user = await User.findById(payload.sub).lean()
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, data: { id: user._id, name: user.name, email: user.email, college: user.college, phone: user.phone, emailVerified: user.emailVerified } })
}




