import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '../../../../server/models/Order';

// GET all orders (admin) or user orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Parse query parameters
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    const status = url.searchParams.get('status');
    
    // If admin, return all orders
    // If regular user, return only their orders
    let query: Record<string, unknown> = ['admin', 'superadmin'].includes(session.user.role)
      ? {}
      : { userId: session.user.id };
    
    // Add status filter if provided
    if (status) {
      query = { ...query, status };
    }
    
    let ordersQuery = Order.find(query).sort({ createdAt: -1 });
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        ordersQuery = ordersQuery.limit(limitNum);
      }
    }
    
    const orders = await ordersQuery.exec();
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST a new order (authenticated users only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { items, totalAmount, shippingAddress, paymentMethod } = body;
    
    // Validate required fields
    if (!items || !items.length || !totalAmount || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Items, totalAmount, shippingAddress, and paymentMethod are required' },
        { status: 400 }
      );
    }
    
    // Validate shipping address
    const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;
    if (!firstName || !lastName || !address || !city || !postalCode || !country || !phone) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const newOrder = new Order({
      userId: session.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });
    
    await newOrder.save();
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 