# Email Setup Guide for Password Reset

## Quick Setup Options

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "CampusShelf" as the name
   - Copy the 16-character password

3. **Add to `.env.local`:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@campusshelf.com
```

### Option 2: Other SMTP Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

**Outlook/Office365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

## Development Mode

If SMTP is not configured:
- Password reset will still work
- Reset links will be logged to the console
- You can copy the link from console to test

## Production Setup (Render)

Add these environment variables in Render dashboard:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NEXT_PUBLIC_APP_URL` (your Render app URL)

## Testing

1. Go to `/forgot-password`
2. Enter your email
3. Check your email inbox (and spam folder)
4. Click the reset link
5. Set a new password

## Troubleshooting

**Email not received:**
- Check spam/junk folder
- Verify SMTP credentials are correct
- Check console logs for errors
- In development, check console for reset link

**Gmail "Less secure app" error:**
- Use App Password instead of regular password
- Enable 2FA first

**Connection timeout:**
- Check firewall settings
- Verify SMTP port (587 for TLS, 465 for SSL)

