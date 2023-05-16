import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Gym, User } from '@prisma/client';

const fetchUser = async (email: string) => {
  const { data } = await axios.post('/api/users/getByEmail', { email });
  return data.user;
};

type FinalUser = User & {
  gym: {
    users: User[];
  } & Gym;
};

const useGetUser = (email: string) => {
  return useQuery<FinalUser, Error>(['user', email], () => fetchUser(email), {
    enabled: !!email,

    // could be okay, but not sure on long term/with more data

    // was the solution to help chats and messages update
    // staleTime: 1000,
    // refetchInterval: 1000,
  });
};

export { fetchUser, useGetUser };
