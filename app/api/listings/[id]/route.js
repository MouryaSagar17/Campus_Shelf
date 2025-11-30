import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Listing from '@/models/Listing'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import configuredCloudinary from '@/lib/cloudinary'

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

    const existing = await Listing.findById(id)
    if (!existing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (String(existing.ownerId) !== String(session.sub)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const contentType = request.headers.get('content-type') || ''

    // Handle multipart/form-data (with images)
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const updates = {}
      
      // Handle text fields
      const title = form.get('title')
      const description = form.get('description')
      const category = form.get('category')
      const priceRaw = form.get('price')
      const college = form.get('college')
      
      if (title) updates.title = String(title).trim()
      if (description) updates.description = String(description).trim()
      if (category) updates.category = String(category).trim()
      if (priceRaw) {
        const price = Number(priceRaw)
        if (!Number.isNaN(price) && price > 0) updates.price = price
      }
      if (college) updates.college = String(college).trim()

      // Handle image uploads
      const files = form.getAll('images')
      const keepExisting = form.get('keepExistingImages') === 'true'
      
      if (files && files.length > 0) {
        const imageUrls = []
        
        // Keep existing images if requested
        if (keepExisting && existing.images && existing.images.length > 0) {
          imageUrls.push(...existing.images)
        }
        
        // Process new images
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file && typeof file.arrayBuffer === 'function') {
            try {
              const arrayBuffer = await file.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              
              if (configuredCloudinary?.uploader?.upload_stream) {
                const uploadUrl = await new Promise((resolve, reject) => {
                  const stream = configuredCloudinary.uploader.upload_stream({ folder: 'campus-shelf' }, (err, result) => {
                    if (err) return reject(err)
                    resolve(result.secure_url)
                  })
                  stream.end(buffer)
                })
                imageUrls.push(uploadUrl)
              } else {
                // Fallback: base64
                const base64 = buffer.toString('base64')
                const mimeType = file.type || 'image/jpeg'
                const dataUrl = `data:${mimeType};base64,${base64}`
                imageUrls.push(dataUrl)
              }
            } catch (uploadError) {
              console.error(`Image upload error:`, uploadError)
            }
          }
        }
        
        if (imageUrls.length > 0) {
          updates.images = imageUrls
        } else {
          // If no images after processing, use existing or placeholder
          updates.images = existing.images && existing.images.length > 0 ? existing.images : ['/placeholder.svg']
        }
      } else {
        // No new images uploaded - keep existing if requested, otherwise keep them anyway
        if (keepExisting && existing.images && existing.images.length > 0) {
          updates.images = existing.images
        }
        // If keepExisting is false, we don't update images (they stay as is)
      }

      const updated = await Listing.findByIdAndUpdate(id, updates, { new: true })
      return NextResponse.json({ ok: true, data: updated })
    }

    // Handle JSON body (text updates only)
    const body = await request.json()
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
