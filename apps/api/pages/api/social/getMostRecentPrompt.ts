import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { GenericData } from '@/types/GenericData';

type Data = {} & GenericData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle the OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    // get most recent prompt
    const prompt = await prisma.prompt.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ prompt });
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
}
