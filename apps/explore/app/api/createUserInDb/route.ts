import axios from 'axios';
import { NextResponse } from 'next/server';

type Input = {
  baseWebAccount?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  gym: {
    name: string;
    latitude: number;
    longitude: number;
    adddress: string;
    photos: { photo_reference: string }[];
    placeId: string;
  };
  longitude: number;
  latitude: number;
};

export async function POST(request: Request) {
  const input = await request.json();
  console.log('input', input);
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/baseWebAccount`,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    NextResponse.json({ message: 'user saved in db' });
  } catch (error) {
    console.log('error', error);
    NextResponse.json({ message: 'error saving user in db' });
  }
}
