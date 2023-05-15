import { GenericData } from '@/types/GenericData';
import { JWT } from '@/types/JWT';
import { User } from '@prisma/client';
import { decode } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type Data = {
  user?: User;
} & GenericData;

type Input = {
  id: string;
  age: number;
  bio: string;
  images: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const input = req.body as Input;
  console.log('input', input);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!user) throw new Error('User not found');

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        age: input.age || 18,
        bio: input.bio || user.bio,
        images: input.images || user.images,
      },
    });

    res.status(200).json({
      message: 'User updated',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'error',
    });
  }
}
