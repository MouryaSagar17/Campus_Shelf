import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { verifyJwt, TOKEN_COOKIE } from '@/lib/auth'
import Order from '@/models/Order'

export async function GET(request) {
  await connectToDatabase()
  const cookie = request.cookies.get(TOKEN_COOKIE)?.value
  const session = cookie ? verifyJwt(cookie) : null
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const orders = await Order.find({ userId: session.sub }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ ok: true, data: orders })
}

export async function POST(request) {
  await connectToDatabase()
  const cookie = request.cookies.get(TOKEN_COOKIE)?.value
  const session = cookie ? verifyJwt(cookie) : null
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { items, subtotal, tax, total, paymentMethod } = body
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: 'No items' }, { status: 400 })
  }

  const order = await Order.create({ userId: session.sub, items, subtotal, tax, total, paymentMethod })
  return NextResponse.json({ ok: true, data: order }, { status: 201 })
}




