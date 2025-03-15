import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// POST to upload an image (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check if the file is an SVG
    if (file.type !== 'image/svg+xml') {
      return NextResponse.json(
        { error: 'Only SVG files are allowed' },
        { status: 400 }
      );
    }
    
    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
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
    
    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload the file to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
    });
    
    // Handle upload errors
    uploadStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    });
    
    // Write the buffer to the upload stream
    uploadStream.write(buffer);
    uploadStream.end();
    
    // Wait for the upload to complete
    await new Promise<void>((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve();
      });
      uploadStream.on('error', (error) => {
        reject(error);
      });
    });
    
    // Return the file ID and URL
    const fileId = uploadStream.id.toString();
    const fileUrl = `/api/uploads/${fileId}`;
    
    return NextResponse.json({
      id: fileId,
      url: fileUrl,
      filename,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 