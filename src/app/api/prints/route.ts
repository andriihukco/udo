import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Print from '../../../../server/models/Print';

// GET all prints
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const limit = url.searchParams.get('limit');
    
    const query: Record<string, unknown> = {};
    
    // Apply filters if provided
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    await dbConnect();
    
    let printsQuery = Print.find(query);
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        printsQuery = printsQuery.limit(limitNum);
      }
    }
    
    const prints = await printsQuery.exec();
    
    return NextResponse.json(prints);
  } catch (error) {
    console.error('Error fetching prints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prints' },
      { status: 500 }
    );
  }
}

// POST a new print (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate required fields
    const { name, price, description, image, category } = body;
    
    if (!name || !price || !description || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const newPrint = new Print(body);
    await newPrint.save();
    
    return NextResponse.json(newPrint, { status: 201 });
  } catch (error) {
    console.error('Error creating print:', error);
    return NextResponse.json(
      { error: 'Failed to create print' },
      { status: 500 }
    );
  }
} 