import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const input = searchParams.get('input');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  console.log(process.env.NEXT_PUBLIC_API_URL);

  const predictionsURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&key=${apiKey}`;

  try {
    const response = await axios.get(predictionsURL);
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

    const syncedGymPromises = predictions.map(
      async (prediction: { description: string; place_id: string }) => {
        try {
          const placeIdURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${apiKey}`;
          const placeDetails = await axios.get(placeIdURL);
          const geometry = placeDetails.data.result.geometry;
          console.log('placeDetails', placeDetails.data.result);
          const placePhotos = [];
          // const photoRefURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`;

          const syncedGym = gyms.find(
            (g: { name: string; users: [] }) =>
              g?.name === prediction.description
          );
          return {
            ...prediction,
            members: syncedGym?.users.length || 0,
            longitude: geometry.location.lng,
            latitude: geometry.location.lat,
            gymTheme: placeDetails.data.result.icon_background_color,
            gymAddress: placeDetails.data.result.formatted_address,
            photos: placeDetails.data.result.photos,
          };
        } catch (error) {
          console.log('error', error);
        }
      }
    );

    const syncedGyms = await Promise.all(syncedGymPromises);

    return NextResponse.json({ predictions: syncedGyms });
  } catch (error) {
    return NextResponse.json({ error: 'error' });
  }
}
