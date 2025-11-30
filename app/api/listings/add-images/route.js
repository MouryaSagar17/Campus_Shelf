import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Listing from '@/models/Listing'

// Map categories to relevant images
const categoryImageMap = {
  'Notes': [
    '/calculus-notes-textbook.jpg',
    '/discrete-mathematics-logic-sets.jpg',
    '/organic-chemistry-textbook-reactions.jpg',
    '/physics-mechanics-textbook.jpg',
    '/data-structures-algorithms-programming.jpg',
    '/shakespeare-english-literature.jpg',
    '/economics-principles-microeconomics.jpg',
  ],
  'Books': [
    '/calculus-notes-textbook.jpg',
    '/discrete-mathematics-logic-sets.jpg',
    '/organic-chemistry-textbook-reactions.jpg',
    '/physics-mechanics-textbook.jpg',
    '/data-structures-algorithms-programming.jpg',
    '/shakespeare-english-literature.jpg',
    '/economics-principles-microeconomics.jpg',
  ],
  'Electronics': [
    '/basic-calculator.png',
    '/scientific-calculator.jpg',
    '/wireless-earbuds.png',
    '/wireless-earbuds-charging-case.png',
  ],
  'Rental Laptops': [
    '/macbook-pro-laptop.png',
    '/dell-laptop-computer.jpg',
    '/silver-macbook-on-desk.png',
    '/dell-products.png',
  ],
  'Lab Uniforms': [
    '/lab-coat-apron-uniform.jpg',
  ],
  'Stationery': [
    '/stationery-flatlay.png',
    '/stationery-pens-notebooks.jpg',
  ],
  'ID Card Tags': [
    '/id-card-holder-tags.jpg',
  ],
  'Lab Equipment': [
    '/classic-microscope.png',
    '/microscope-slides-lab-equipment.jpg',
    '/laboratory-scene.png',
    '/chemistry-lab-setup.png',
  ],
}

// Fallback images for any category
const fallbackImages = [
  '/placeholder.jpg',
  '/calculus-concepts.png',
  '/chemistry-organic-study-guide.jpg',
  '/discrete.jpg',
  '/dsa.jpg',
  '/economics-concept.png',
  '/organic-arrangement.png',
  '/physics-concepts.png',
  '/shakespeare-portrait.png',
  '/abstract-id.png',
]

function getRandomImages(category, count = 3) {
  const categoryImages = categoryImageMap[category] || []
  const availableImages = categoryImages.length > 0 ? categoryImages : fallbackImages
  
  // Shuffle and pick random images
  const shuffled = [...availableImages].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))
  
  // If we need more images, fill with fallback
  while (selected.length < count) {
    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    if (!selected.includes(randomFallback)) {
      selected.push(randomFallback)
    }
  }
  
  return selected.slice(0, count)
}

export async function POST() {
  try {
    await connectToDatabase()

    // Get all listings
    const allListings = await Listing.find({})
    console.log(`Found ${allListings.length} listings to update`)

    let updated = 0
    let skipped = 0

    for (const listing of allListings) {
      // Skip if already has real images (not just placeholders)
      const hasRealImages = listing.images && listing.images.some(img => 
        img && 
        !img.includes('placeholder') && 
        !img.startsWith('data:') &&
        img.startsWith('/')
      )

      if (hasRealImages && listing.images.length >= 3) {
        skipped++
        continue
      }

      // Get appropriate images for this category
      const category = listing.category || 'Notes'
      const images = getRandomImages(category, 3)

      await Listing.findByIdAndUpdate(listing._id, {
        $set: { images }
      })

      updated++
      console.log(`Updated listing "${listing.title}" (${category}) with ${images.length} images`)
    }

    return NextResponse.json({ 
      ok: true, 
      message: `Updated ${updated} listings with real images. Skipped ${skipped} listings that already had images.`,
      updated,
      skipped,
      total: allListings.length
    })
  } catch (e) {
    console.error('Error updating images:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const allListings = await Listing.find({})
    const listingsWithPlaceholders = allListings.filter(listing => {
      if (!listing.images || listing.images.length === 0) return true
      return listing.images.every(img => 
        img && (img.includes('placeholder') || img.startsWith('data:'))
      )
    })

    return NextResponse.json({ 
      ok: true, 
      totalListings: allListings.length,
      listingsWithPlaceholders: listingsWithPlaceholders.length,
      listingsWithRealImages: allListings.length - listingsWithPlaceholders.length,
      message: `Found ${listingsWithPlaceholders.length} listings with only placeholders out of ${allListings.length} total listings`
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

