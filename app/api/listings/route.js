import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Listing from '@/models/Listing'
import configuredCloudinary from '@/lib/cloudinary'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'

export async function GET(request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const college = searchParams.get('college')
    const q = searchParams.get('q')
    const sort = searchParams.get('sort') // price, -price, rating, -rating, -createdAt

    const filter = {}
    if (category && category !== 'All') filter.category = category
    if (college && college !== 'All Colleges') filter.college = college
    if (q) {
      const rx = { $regex: q, $options: 'i' }
      filter.$or = [{ title: rx }, { category: rx }]
    }

    const skip = (page - 1) * limit

    const sortSpec = {}
    if (sort) {
      const dir = sort.startsWith('-') ? -1 : 1
      const key = sort.replace('-', '')
      sortSpec[key] = dir
    } else {
      sortSpec.createdAt = -1
    }

    const [items, total] = await Promise.all([
      Listing.find(filter).sort(sortSpec).skip(skip).limit(limit).lean(),
      Listing.countDocuments(filter),
    ])

    return NextResponse.json({ ok: true, data: items, page, limit, total })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectToDatabase()

    // Require authentication for posting
    const cookie = request.cookies.get(TOKEN_COOKIE)?.value
    const session = cookie ? verifyJwt(cookie) : null
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized. Please login to post an ad.' }, { status: 401 })
    }

    const attachOwner = (doc) => {
      // Session is guaranteed to exist here
      doc.ownerId = session.sub
      doc.ownerName = session.name
      return doc
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const title = String(form.get('title') || '').trim()
      const description = String(form.get('description') || '').trim()
      const category = String(form.get('category') || '').trim()
      const priceRaw = String(form.get('price') || '').trim()
      const college = String(form.get('college') || '').trim()
      const files = form.getAll('images')

      const price = Number(priceRaw)
      if (!title || !description || !category || !college || Number.isNaN(price) || price <= 0 || files.length < 3) {
        return NextResponse.json({ ok: false, error: 'Invalid form data: title, description, category, college required, price must be > 0, and at least 3 images required' }, { status: 400 })
      }

      const payload = attachOwner({ title, description, category, price, college })
      if (files && files.length > 0) {
        console.log(`Processing ${files.length} image(s)...`)
        const imageUrls = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // Check if file is a File object (has arrayBuffer method)
          if (file && typeof file.arrayBuffer === 'function') {
            try {
              const arrayBuffer = await file.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              console.log(`Image ${i + 1}: ${file.name || 'unnamed'}, size: ${buffer.length} bytes, type: ${file.type}`)
              
              // Try Cloudinary first
              if (configuredCloudinary?.uploader?.upload_stream) {
                const uploadUrl = await new Promise((resolve, reject) => {
                  const stream = configuredCloudinary.uploader.upload_stream({ folder: 'campus-shelf' }, (err, result) => {
                    if (err) return reject(err)
                    resolve(result.secure_url)
                  })
                  stream.end(buffer)
                })
                imageUrls.push(uploadUrl)
                console.log(`Image ${i + 1} uploaded to Cloudinary: ${uploadUrl}`)
              } else {
                // Fallback: Convert to base64 data URL and store in database
                const base64 = buffer.toString('base64')
                const mimeType = file.type || 'image/jpeg'
                const dataUrl = `data:${mimeType};base64,${base64}`
                imageUrls.push(dataUrl)
                console.log(`Image ${i + 1} saved as base64 (Cloudinary not configured), size: ${dataUrl.length} chars`)
              }
            } catch (uploadError) {
              console.error(`Image ${i + 1} upload error:`, uploadError)
              // Continue with other images, add placeholder for failed upload
              imageUrls.push('/placeholder.svg')
            }
          } else {
            // If file is not a valid File object, add placeholder
            console.warn(`Image ${i + 1}: Invalid file object, using placeholder`)
            imageUrls.push('/placeholder.svg')
          }
        }
        payload.images = imageUrls.length > 0 ? imageUrls : ['/placeholder.svg']
        console.log(`Total images saved: ${imageUrls.length}`)
      } else {
        // If no images provided, set default placeholder
        payload.images = ['/placeholder.svg']
        console.warn('No images provided, using placeholder')
      }

      const created = await Listing.create(payload)
      return NextResponse.json({ ok: true, data: created }, { status: 201 })
    }

    const body = await request.json()
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const category = String(body.category || '').trim()
    const price = Number(body.price)
    const college = String(body.college || '').trim()

    if (!title || !category || !college || Number.isNaN(price) || price <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid request: title, category, college required and price must be > 0' }, { status: 400 })
    }

    const created = await Listing.create(attachOwner({ title, description, category, price, college }))
    return NextResponse.json({ ok: true, data: created }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
