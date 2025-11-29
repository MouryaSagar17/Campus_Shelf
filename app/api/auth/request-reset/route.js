import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import crypto from 'crypto'

export async function POST(request) {
  await connectToDatabase()
  const { email } = await request.json()
  if (!email) return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 })

  const user = await User.findOne({ email })
  if (!user) return NextResponse.json({ ok: true })

  const token = crypto.randomBytes(24).toString('hex')
  user.resetToken = token
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30)
  await user.save()

  // In production, send an email with the reset link containing the token
  return NextResponse.json({ ok: true })
}






