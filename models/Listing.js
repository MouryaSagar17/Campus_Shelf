import mongoose from 'mongoose'

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    image: { type: String },
    images: [{ type: String }],
    college: { type: String, required: true },
    seller: { type: String },
    sellerId: { type: Number },
    sellerPhone: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    postedAt: { type: Date, default: Date.now },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerName: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
