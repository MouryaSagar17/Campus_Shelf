import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Listing from '@/models/Listing'

export async function POST() {
  try {
    await connectToDatabase()

    // Find all listings that don't have images or have empty images array
    const listingsWithoutImages = await Listing.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    })

    console.log(`Found ${listingsWithoutImages.length} listings without images`)

    let updated = 0
    for (const listing of listingsWithoutImages) {
      await Listing.findByIdAndUpdate(listing._id, {
        $set: { images: ['/placeholder.svg'] }
      })
      updated++
    }

    // Also check for listings with placeholder-only images that should have real images
    const allListings = await Listing.find({})
    let fixed = 0
    for (const listing of allListings) {
      if (listing.images && listing.images.length > 0) {
        // Check if all images are placeholders
        const allPlaceholders = listing.images.every(img => 
          img === '/placeholder.svg' || 
          img === '/placeholder.jpg' || 
          img === '/placeholder.png' ||
          !img
        )
        
        // If all are placeholders and we have more than one, keep just one
        if (allPlaceholders && listing.images.length > 1) {
          await Listing.findByIdAndUpdate(listing._id, {
            $set: { images: ['/placeholder.svg'] }
          })
          fixed++
        }
      }
    }

    return NextResponse.json({ 
      ok: true, 
      message: `Updated ${updated} listings without images. Fixed ${fixed} listings with multiple placeholders.`,
      updated,
      fixed,
      total: listingsWithoutImages.length
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const listingsWithoutImages = await Listing.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    }).countDocuments()

    const totalListings = await Listing.countDocuments()

    return NextResponse.json({ 
      ok: true, 
      listingsWithoutImages,
      totalListings,
      message: `Found ${listingsWithoutImages} listings without images out of ${totalListings} total listings`
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

