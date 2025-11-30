# Quick Email Setup for Password Reset

## Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. If prompted, enable 2-Factor Authentication first
4. Select "Mail" and device "Other (Custom name)"
5. Type "CampusShelf" and click "Generate"
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

## Step 2: Add to .env.local

Open your `.env.local` file and add these lines at the end:

```env
# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password-here
SMTP_FROM=noreply@campusshelf.com
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `your-16-char-app-password-here` with the 16-character app password (remove spaces)

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=shaikimran050403@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=noreply@campusshelf.com
```

## Step 3: Restart Your Server

After adding the SMTP settings:
1. Stop your dev server (Ctrl+C)
2. Start it again: `pnpm dev`

## Step 4: Test

1. Go to `/forgot-password`
2. Enter your email
3. Check your email inbox (and spam folder)
4. You should receive the reset email!

## Troubleshooting

**Still not working?**
- Make sure you used the **App Password**, not your regular Gmail password
- Check that 2FA is enabled on your Gmail account
- Verify the password has no spaces (remove them if present)
- Check server console for error messages
- Make sure you restarted the server after adding the config

