import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    college: { type: String },
    phone: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
