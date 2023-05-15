import axios from 'axios';
import { NextResponse } from 'next/server';

type Input = {
  id: string;
  age: number;
  bio: string;
  images: string[];
};

export async function POST(request: Request) {
  const input = await request.json();
  console.log('input', input);
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/updateUserProfile`,
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
