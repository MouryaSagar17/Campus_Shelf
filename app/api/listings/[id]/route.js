import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Listing from '@/models/Listing'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'

export async function GET(_req, { params }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const listing = await Listing.findById(id).lean()
    if (!listing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true, data: listing })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const cookie = request.cookies.get(TOKEN_COOKIE)?.value
    const session = cookie ? verifyJwt(cookie) : null
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const existing = await Listing.findById(id)
    if (!existing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (String(existing.ownerId) !== String(session.sub)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const updated = await Listing.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json({ ok: true, data: updated })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const cookie = request.cookies.get(TOKEN_COOKIE)?.value
    const session = cookie ? verifyJwt(cookie) : null
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const existing = await Listing.findById(id)
    if (!existing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (String(existing.ownerId) !== String(session.sub)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    await Listing.findByIdAndDelete(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
