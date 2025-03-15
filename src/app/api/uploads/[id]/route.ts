import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

// GET a specific uploaded file
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get the MongoDB connection
    const conn = mongoose.connection;
    const db = conn.db;
    
    // Check if db is defined
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Create a GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });
    
    // Find the file metadata
    const files = await db.collection('uploads.files').findOne({
      _id: new ObjectId(id)
    });
    
    if (!files) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Create a download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    
    // Convert the stream to a buffer
    const chunks: Buffer[] = [];
    
    // Wait for the download to complete
    await new Promise<void>((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      });
      
      downloadStream.on('error', (error) => {
        reject(error);
      });
      
      downloadStream.on('end', () => {
        resolve();
      });
    });
    
    // Combine the chunks into a single buffer
    const buffer = Buffer.concat(chunks);
    
    // Create a response with the appropriate content type
    const response = new NextResponse(buffer);
    
    // Set the content type header
    response.headers.set('Content-Type', files.contentType);
    
    return response;
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}

// DELETE a specific upload (admin only)
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
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get the MongoDB connection
    const conn = mongoose.connection;
    const db = conn.db;
    
    // Check if db is defined
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Create a GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });
    
    // Find the file metadata
    const file = await db.collection('uploads.files').findOne({
      _id: new ObjectId(id)
    });
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Delete the file
    await bucket.delete(new ObjectId(id));
    
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting upload:', error);
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    );
  }
} 