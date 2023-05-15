import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type Input = {
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body as Input;
  console.log('input', input);
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      gym: {
        select: {
          id: true,
          placeId: true,
          name: true,
          latitude: true,
          longitude: true,
          address: true,
          photos: true,
          users: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized - no user' });
  }

  const gyms = [];
  gyms.push(user.gym);

  console.log({ gym: user.gym });

  return res.status(200).json({ gyms });
}
