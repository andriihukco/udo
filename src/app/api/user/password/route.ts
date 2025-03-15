import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '../../../../../server/models/User';
import { compare, hash } from 'bcrypt';

// PUT (update) user password
export async function PUT(req: NextRequest) {
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
    const { currentPassword, newPassword } = body;
    
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find the user with password
    // @ts-expect-error - We need to use this syntax for Mongoose
    const user = await User.findById(session.user.id).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if the user has a password (might be using OAuth)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Please login via the method you used to create your account' },
        { status: 400 }
      );
    }
    
    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update the password
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
} 