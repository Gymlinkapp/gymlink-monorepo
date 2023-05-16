import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type Data = {} & GenericData;

type Input = {
  gymId: string;
  placeId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body as Input;
  let gym;

  if (input.gymId && !input.placeId) {
    gym = await prisma.gym.findFirst({
      where: {
        id: input.gymId,
      },
    });
  } else if (input.placeId && !input.gymId) {
    gym = await prisma.gym.findFirst({
      where: {
        placeId: input.placeId,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            age: true,
            firstName: true,
            lastName: true,
            split: true,
            images: true,
          },
        },
      },
    });
  }

  if (!gym) {
    res.status(401).json({
      error: 'Unauthorized',
    });
    return;
  }

  res.status(200).json({ gym });
}
