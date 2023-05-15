import { GenericData } from '@/types/GenericData';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
type Data = {} & GenericData;
type Input = {
  baseWebAccount?: boolean;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  images?: string[];
  gym: {
    name: string;
    latitude: number;
    longitude: number;
    adddress: string;
    photos: { photo_reference: string }[];
    placeId: string;
  };
  longitude: number;
  latitude: number;
};

const generateRandomPhoneNumber = () => {
  const randomId = Math.floor(Math.random() * 1000000000);
  return `+1${randomId}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body as Input;
  console.log('input2 ', input);

  if (!input.email) {
    res.status(401).json({
      error: 'Unauthorized - no email',
    });
    return;
  }

  try {
    // if a user exists dont create a new one
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    console.log('user', user);

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          id: input.id || randomUUID(),
          phoneNumber: generateRandomPhoneNumber(),
          firstName: input.firstName || 'User',
          lastName: input.lastName || 'User',
          email: input.email,
          gym: {
            connectOrCreate: {
              where: {
                placeId: input.gym.placeId,
              },
              create: {
                name: input.gym.name,
                latitude: input.gym.latitude,
                longitude: input.gym.longitude,
                address: input.gym.adddress,
                photos: input.gym.photos,
                placeId: input.gym.placeId,
              },
            },
          },
          longitude: input.longitude,
          latitude: input.latitude,
          password: '',
          images: input.images || [],
          tempJWT: '',
          age: 0,
          filterGender: [],
          filterGoals: [],
          filterSkillLevel: [],
          filterWorkout: [],
          filterGoingToday: false,
          tags: [],
          blockedUsers: [],
          bio: '',
        },
      });

      console.log('newUser', newUser);
      res.status(200).json(newUser);
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    console.log('oops');
    console.log(error);

    res.status(401).json({
      error: 'Unauthorized',
    });
    return;
  }
}
