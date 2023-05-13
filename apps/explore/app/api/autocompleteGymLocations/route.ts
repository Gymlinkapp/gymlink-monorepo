import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const input = searchParams.get('input');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  console.log(process.env.NEXT_PUBLIC_API_URL);

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const predictions = response.data.predictions;

    // Extract place_ids from the predictions
    const gymNames: string[] = predictions.map(
      (prediction: { description: string }) => prediction.description
    );

    // Fetch gyms from the database based on place_ids
    const gymsRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gyms/getAllGyms`,
      {
        gymNames,
      }
    );

    const gyms = gymsRes.data.gyms;

    const syncedGyms = predictions.map(
      (prediction: { description: string }) => {
        const syncedGym = gyms.find(
          (g: { name: string; users: [] }) => g?.name === prediction.description
        );
        return {
          ...prediction,
          members: syncedGym?.users.length || 0,
          // Add any additional data from the database gym object if needed
        };
      }
    );

    return NextResponse.json({ predictions: syncedGyms });
  } catch (error) {
    return NextResponse.json({ error: 'error' });
  }
}
