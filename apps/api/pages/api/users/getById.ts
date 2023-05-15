import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

type Data = {
  user?: User;
} & GenericData;

type Input = {
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const input = req.body as Input;
  console.log('input', input);
  if (!input.userId) {
    res.status(400).json({
      message: 'No userId provided',
    });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      include: {
        userPrompts: true,
        gym: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      message: 'User found',
      user,
    });
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
}
