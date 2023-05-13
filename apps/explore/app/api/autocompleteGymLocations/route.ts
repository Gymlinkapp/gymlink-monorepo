import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const input = searchParams.get('input');

  //   const apiKey = process.env.GOOGLE_API_KEY;
  const apiKey = 'AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA';

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&key=${apiKey}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'error' });
  }
}
