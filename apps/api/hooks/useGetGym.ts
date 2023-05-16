import { Gym, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type FinalGym = Gym & { users: User[] };

const fetchGym = async (placeId: string) => {
  const { data } = await axios.post(`/api/gyms/getById`, { placeId });
  return data.gym;
};

const useGym = (placeId: string) => {
  return useQuery<FinalGym, Error>(['gym', placeId], () => fetchGym(placeId));
};

export { fetchGym, useGym };
