import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type Data = {} & GenericData;

type Input = {
  gymNames: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body as Input;
  console.log('input', input);

  Promise.all(
    input.gymNames.map(async (gymName) => {
      const gym = await prisma.gym.findFirst({
        where: {
          name: gymName,
        },
        include: {
          users: true,
        },
      });
      return gym;
    })
  )
    .then((gyms) => {
      return res.status(200).json({ gyms });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
}
