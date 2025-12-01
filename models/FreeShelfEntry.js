import mongoose from 'mongoose'

const FreeShelfEntrySchema = new mongoose.Schema(
  {
    branchId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true }, // text content to read online
    fileName: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerName: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.FreeShelfEntry || mongoose.model('FreeShelfEntry', FreeShelfEntrySchema)


