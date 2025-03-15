import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserModel } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const User = getUserModel();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    );
  }
} 