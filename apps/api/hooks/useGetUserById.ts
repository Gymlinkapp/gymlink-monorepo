import { FinalUser } from '@/types/user';
import { Gym, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUserById = async (userId: string) => {
  const { data } = await axios.post(`/api/users/getById`, {
    userId,
  });
  return data.user;
};

const useUserById = (userId: string) => {
  return useQuery<FinalUser, Error>(['user-profile', userId], () =>
    fetchUserById(userId)
  );
};

export { fetchUserById, useUserById };
