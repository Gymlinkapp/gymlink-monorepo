import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // const res = await axios.get(`/api/getGym?gymId=${placeId}`);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('gymId');
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gyms/getById`,
      {
        placeId: id,
      }
    );

    return NextResponse.json({ gym: res.data.gym });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ message: 'error fetching gyms' });
  }
}
