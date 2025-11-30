import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Add it to .env.local')
}

let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || 'campus_shelf',
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        connectTimeoutMS: 30000, // 30 seconds
        retryWrites: true,
        w: 'majority',
      })
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected successfully')
        return mongooseInstance
      })
      .catch((error) => {
        cached.promise = null
        console.error('❌ MongoDB connection error:', error.message)
        if (error.message.includes('ETIMEOUT') || error.message.includes('querySrv')) {
          console.error('💡 DNS resolution failed. Try:')
          console.error('   1. Change DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)')
          console.error('   2. Check MongoDB Atlas Network Access - whitelist your IP')
          console.error('   3. Check firewall/VPN settings')
        }
        throw error
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}






