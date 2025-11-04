import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'

export async function POST(request) {
  await connectToDatabase()
  const { token } = await request.json()
  if (!token) return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 })

  const user = await User.findOne({ verificationToken: token })
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 400 })
  user.emailVerified = true
  user.verificationToken = undefined
  await user.save()
  return NextResponse.json({ ok: true })
}




