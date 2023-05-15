import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/getById`,
      {
        userId,
      }
    );
    return NextResponse.json({ user: res.data.user });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ message: 'error fetching user' });
  }
}
