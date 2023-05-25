import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Gym, User } from '@prisma/client';

const fetchUsers = async () => {
  const { data } = await axios.get('/api/users/getAllUsers');
  return data.users;
};

export const useGetAllUsers = () => {
  return useQuery<User[], Error>(['users'], fetchUsers);
};
