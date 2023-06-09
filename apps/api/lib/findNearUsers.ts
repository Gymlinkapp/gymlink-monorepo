import { Gym, PrismaClient, User } from '@prisma/client';
import { haversineDistance } from './haversineDistance';

const prisma = new PrismaClient();

// find distance between each user and all gyms, then check if any gym is within the radius (50km).
export const findNearUsers = async (
  user: User,
  logs?: boolean
): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: {
      // Exclude users that are present in the blockedUserIds array
      NOT: user.blockedUsers
        ? {
            id: {
              in: user.blockedUsers as string[],
            },
          }
        : {},
    },
    include: {
      gym: {
        select: {
          name: true,
        },
      },
      userPrompts: {
        select: {
          answer: true,
          hasAnswered: true,
          createdAt: true,
          userId: true,
          prompt: true,
        },
      },
      chats: {
        select: {
          participants: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const gymLocations = await prisma.gym.findMany();

  async function filterUsers() {
    const filteredUsersPromises = users.map(async (user) => {
      const userLocation = {
        latitude: user.latitude as number,
        longitude: user.longitude as number,
      };

      const gymDistances = await Promise.all(
        gymLocations.map(async (gym) => {
          if (!gym.latitude || !gym.longitude) return Infinity;
          const distance = haversineDistance(userLocation, {
            latitude: gym.latitude,
            longitude: gym.longitude,
          });

          return distance;
        })
      );

      const isWithinGymRadius = gymDistances.some((distance) => distance <= 50);

      if (!isWithinGymRadius) return null;

      return user;
    });

    const filteredUsers = (await Promise.all(filteredUsersPromises)).filter(
      (user) => user !== null
    );

    return filteredUsers.filter((u) => u?.id !== user?.id) as User[];
  }

  return filterUsers(); // Return the result of filterUsers
};
