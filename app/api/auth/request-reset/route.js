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

    // Get base URL - prioritize environment variable
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL
    
    if (!baseUrl) {
      // Try to get from request headers (for production deployments)
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 
                      (request.headers.get('x-forwarded-ssl') === 'on' ? 'https' : 'http')
      
      if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        baseUrl = `${protocol}://${host}`
      } else {
        // For localhost, use localhost:3000
        baseUrl = 'http://localhost:3000'
        console.warn('⚠️  NEXT_PUBLIC_APP_URL not set. Using localhost. For production, set NEXT_PUBLIC_APP_URL in .env.local')
      }
    }
    
    // Ensure baseUrl doesn't have trailing slash
    baseUrl = baseUrl.replace(/\/$/, '')

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(user.email, token, baseUrl)
      
      // Check if email was actually sent or just logged
      const isDevMode = !process.env.SMTP_HOST && !process.env.SMTP_USER
      
      if (isDevMode || process.env.NODE_ENV === 'development') {
        console.log('='.repeat(60))
        console.log('📧 PASSWORD RESET LINK (SMTP not configured):')
        console.log(`${baseUrl}/reset-password?token=${token}`)
        console.log('='.repeat(60))
        console.log('To enable email sending, add SMTP config to .env.local')
        console.log('See SETUP_EMAIL.md for instructions')
        console.log('='.repeat(60))
      }
      
      return NextResponse.json({ 
        ok: true, 
        message: 'Password reset email has been sent. Please check your inbox.',
        emailSent: !isDevMode
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      console.error('Error details:', emailError.message)
      
      // In development, still return success with console link
      if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
        console.warn('='.repeat(60))
        console.warn('⚠️  EMAIL NOT SENT - SMTP not configured')
        console.warn('Reset token:', token)
        console.warn('Reset link:', `${baseUrl}/reset-password?token=${token}`)
        console.warn('Add SMTP config to .env.local to send emails')
        console.warn('='.repeat(60))
        return NextResponse.json({ 
          ok: true, 
          message: 'Password reset link generated. Check server console for the link (SMTP not configured).',
          devToken: token,
          devLink: `${baseUrl}/reset-password?token=${token}`
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






