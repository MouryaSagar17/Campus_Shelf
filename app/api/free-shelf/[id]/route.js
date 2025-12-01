import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import FreeShelfEntry from '@/models/FreeShelfEntry'

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const cookie = request.cookies.get(TOKEN_COOKIE)?.value
    const session = cookie ? verifyJwt(cookie) : null
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await FreeShelfEntry.findById(id)
    if (!existing) {
      // Already deleted or never existed - treat as success for idempotency
      return NextResponse.json({ ok: true })
    }

    if (String(existing.ownerId) !== String(session.sub)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    await FreeShelfEntry.findByIdAndDelete(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}


