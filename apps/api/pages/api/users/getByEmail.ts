import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

type Data = {
  user?: User;
} & GenericData;

type Input = {
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const input = req.body as Input;
  console.log('input', input);
  if (!input.email) {
    res.status(400).json({
      message: 'No email provided',
    });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      include: {
        userPrompts: true,
        gym: {
          include: {
            users: true,
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
