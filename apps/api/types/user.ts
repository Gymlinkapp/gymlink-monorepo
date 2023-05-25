import { Gym, User } from '@prisma/client';

export type FinalUser = User & {
  gym: {
    users: User[];
  } & Gym;
};
