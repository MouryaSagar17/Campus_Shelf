import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request) {
  try {
    await connectToDatabase()
    const { email } = await request.json()
    if (!email) return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 })

    const user = await User.findOne({ email })
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
    await user.save()

    // Get base URL from request headers or environment
    const origin = request.headers.get('origin') || request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${origin}`

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, token, baseUrl)
      return NextResponse.json({ 
        ok: true, 
        message: 'Password reset email has been sent. Please check your inbox.' 
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // In development, still return success
      if (process.env.NODE_ENV === 'development') {
        console.warn('Email sending failed in development. Reset token:', token)
        console.warn('Reset link:', `${baseUrl}/reset-password?token=${token}`)
        return NextResponse.json({ 
          ok: true, 
          message: 'Password reset email would be sent. Check console for reset link in development.',
          devToken: process.env.NODE_ENV === 'development' ? token : undefined
        })
      }
      // In production, return error
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to send email. Please try again later.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'An error occurred. Please try again later.' 
    }, { status: 500 })
  }
}






