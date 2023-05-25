import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

type Data = {
  users?: User[];
} & GenericData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            isBot: false,
          },
          {
            city: {
              not: null,
            },
          },
        ],
      },
    });

    console.log(users);

    res.status(200).json({ users, message: 'succsess' });
  } catch (error) {
    console.log(error);
  }
}
