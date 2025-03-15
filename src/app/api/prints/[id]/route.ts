import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Print from '../../../../../server/models/Print';
import mongoose from 'mongoose';

// GET a specific print
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid print ID' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    const print = await Print.findById(id);
    
    if (!print) {
      return NextResponse.json(
        { error: 'Print not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(print);
  } catch (error) {
    console.error('Error fetching print:', error);
    return NextResponse.json(
      { error: 'Failed to fetch print' },
      { status: 500 }
    );
  }
}

// PUT (update) a specific print (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = context.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid print ID' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    // Validate price if provided
    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const updatedPrint = await Print.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPrint) {
      return NextResponse.json(
        { error: 'Print not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPrint);
  } catch (error) {
    console.error('Error updating print:', error);
    return NextResponse.json(
      { error: 'Failed to update print' },
      { status: 500 }
    );
  }
}

// DELETE a specific print (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = context.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid print ID' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const deletedPrint = await Print.findByIdAndDelete(id);
    
    if (!deletedPrint) {
      return NextResponse.json(
        { error: 'Print not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Print deleted successfully' });
  } catch (error) {
    console.error('Error deleting print:', error);
    return NextResponse.json(
      { error: 'Failed to delete print' },
      { status: 500 }
    );
  }
} 