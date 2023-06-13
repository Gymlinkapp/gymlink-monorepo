import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.query.input as string;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const predictionsURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&key=${apiKey}`;

  try {
    const response = await axios.get(predictionsURL);
    const predictions = response.data.predictions;

    return res.status(200).json({ predictions });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
