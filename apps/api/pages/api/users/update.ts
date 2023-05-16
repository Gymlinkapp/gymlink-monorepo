import { JWT } from '@/types/JWT';
import { decode } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { GenericData } from '@/types/GenericData';
import { User } from '@prisma/client';

type Data = {
  user?: User;
} & GenericData;

type Input = {
  token: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  age?: number;
  email?: string;
  tags?: string[];
  images?: string[];
  authSteps?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body as Input;

  let user: User | null = null;

  try {
    if (input.token) {
      const decoded = decode(input.token as string) as JWT;

      user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
    } else if (input.userId) {
      user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
    }

    if (!user) {
      console.log('User not found');
      throw new Error('User not found');
    }

    // if the user is at the last onboard step
    if (user.authSteps === 6) {
      // get the last prompt from the db and create a userPrompt for the user
      const lastPrompt = await prisma.prompt.findFirst({
        orderBy: {
          id: 'desc',
        },
      });

      if (!lastPrompt) {
        console.log('Prompt not found');
        throw new Error('Prompt not found');
      }

      await prisma.userPrompt.create({
        data: {
          userId: user.id,
          promptId: lastPrompt.id,
          hasAnswered: false,
          answer: '',
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: input.firstName || user.firstName,
        lastName: input.lastName || user.lastName,
        email: input.email || user.email,
        bio: input.bio || user.bio,
        age: input.age || 18,
        tags: (input.tags as string[]) || user.tags,
        images:
          [...(input.images as string[]), ...(user.images as string[])] ||
          user.images,
        authSteps:
          input.authSteps !== undefined ? input.authSteps : user.authSteps,
      },
    });

    res.status(200).json({
      message: 'User found',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
}
