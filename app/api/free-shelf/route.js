import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import FreeShelfEntry from '@/models/FreeShelfEntry'

// GET /api/free-shelf?branchId=cse
export async function GET(request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get('branchId')

    const filter = {}
    if (branchId) filter.branchId = branchId

    const entries = await FreeShelfEntry.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ ok: true, data: entries })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// POST /api/free-shelf  (multipart/form-data: branchId, title, description?, file)
export async function POST(request) {
  try {
    await connectToDatabase()

    const cookie = request.cookies.get(TOKEN_COOKIE)?.value
    const session = cookie ? verifyJwt(cookie) : null
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized. Please login to upload to Free Shelf.' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ ok: false, error: 'Invalid content type. Expected multipart/form-data.' }, { status: 400 })
    }

    const form = await request.formData()
    const branchId = String(form.get('branchId') || '').trim()
    const title = String(form.get('title') || '').trim()
    const description = String(form.get('description') || '').trim()
    const file = form.get('file')

    if (!branchId || !title || !file) {
      return NextResponse.json({ ok: false, error: 'branchId, title and file are required.' }, { status: 400 })
    }

    let content = ''
    let fileName = ''

    if (file && typeof file.text === 'function') {
      try {
        content = await file.text()
        fileName = file.name || ''
      } catch (e) {
        console.error('Error reading uploaded file:', e)
        return NextResponse.json({ ok: false, error: 'Failed to read uploaded file. Please upload a text-based file.' }, { status: 400 })
      }
    }

    if (!content) {
      return NextResponse.json({ ok: false, error: 'Uploaded file is empty or unsupported. Please upload a text file (.txt, .md, etc.).' }, { status: 400 })
    }

    const created = await FreeShelfEntry.create({
      branchId,
      title,
      description,
      content,
      fileName,
      ownerId: session.sub,
      ownerName: session.name,
    })

    return NextResponse.json({ ok: true, data: created }, { status: 201 })
  } catch (e) {
    console.error('Free Shelf upload error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}


