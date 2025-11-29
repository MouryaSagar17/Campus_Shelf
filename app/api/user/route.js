import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import User from '@/models/User'

export async function PATCH(request) {
  await connectToDatabase()
  const cookie = request.cookies.get(TOKEN_COOKIE)?.value
  const session = cookie ? verifyJwt(cookie) : null
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updates = {}
  if (typeof body.name === 'string') updates.name = body.name
  if (typeof body.phone === 'string') updates.phone = body.phone
  if (typeof body.college === 'string') updates.college = body.college

  const updated = await User.findByIdAndUpdate(session.sub, updates, { new: true }).lean()
  return NextResponse.json({ ok: true, data: { id: updated._id, name: updated.name, email: updated.email, college: updated.college, phone: updated.phone, emailVerified: updated.emailVerified } })
}






