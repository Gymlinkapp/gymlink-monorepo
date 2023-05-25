import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gyms/getUsersGyms`,
      {
        email,
      }
    );
    console.log('gyms', res.data.gyms);

    return NextResponse.json({ gyms: res.data.gyms });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ message: 'error fetching gyms' });
  }
}
