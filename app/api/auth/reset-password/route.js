import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  await connectToDatabase()
  const { token, password } = await request.json()
  if (!token || !password) return NextResponse.json({ ok: false, error: 'Missing data' }, { status: 400 })

  const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } })
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 400 })

  user.passwordHash = hashPassword(password)
  user.resetToken = undefined
  user.resetTokenExpires = undefined
  await user.save()
  return NextResponse.json({ ok: true })
}




