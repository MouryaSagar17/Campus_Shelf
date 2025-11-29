import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId },
    title: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    subtotal: Number,
    tax: Number,
    total: Number,
    paymentMethod: String,
    status: { type: String, default: 'paid' },
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)






