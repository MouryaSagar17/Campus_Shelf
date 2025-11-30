import nodemailer from 'nodemailer'

// Create transporter based on environment variables
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  // If SMTP is configured, use it
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  }

  // Fallback: Use Gmail OAuth2 or App Password
  // For Gmail, you can use App Password: https://support.google.com/accounts/answer/185833
  if (SMTP_USER && SMTP_PASS && SMTP_USER.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS, // Use App Password, not regular password
      },
    })
  }

  // Development fallback: console log (won't actually send email)
  return {
    sendMail: async (options) => {
      console.log('📧 Email would be sent (SMTP not configured):')
      console.log('To:', options.to)
      console.log('Subject:', options.subject)
      console.log('Reset Link:', options.text.match(/https?:\/\/[^\s]+/)?.[0] || 'N/A')
      return { messageId: 'dev-mode' }
    },
  }
}

export async function sendPasswordResetEmail(email, resetToken, baseUrl) {
  const resetLink = `${baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@campusshelf.com',
    to: email,
    subject: 'Reset Your CampusShelf Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📚 CampusShelf</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your CampusShelf account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666;">
              ${resetLink}
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link will expire in 30 minutes.
            </p>
            <p style="color: #999; font-size: 12px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} CampusShelf. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Reset your CampusShelf password by clicking this link: ${resetLink}\n\nThis link expires in 30 minutes.\n\nIf you didn't request this, please ignore this email.`,
  }

  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    // In development, still return success so the flow continues
    // In production, you might want to handle this differently
    if (process.env.NODE_ENV === 'development') {
      console.warn('Email sending failed, but continuing in development mode')
      return { success: true, messageId: 'dev-mode' }
    }
    throw error
  }
}

