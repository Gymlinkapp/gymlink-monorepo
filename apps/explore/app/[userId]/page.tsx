'use client';

import UserProfileProgress from '@/components/UserProfileProgress';
import { User } from '@/utils/types/user';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { user } = useUser();

  const getUser = async () => {
    if (user) {
      try {
        const res = await axios.get(`/api/getUser?userId=${params.userId}`);
        console.log(res.data);
        return res.data.user as User;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['hydrate-user'],
    enabled: !!user,
    queryFn: () => getUser(),
  });

  console.log(data);

  if (isLoading || !data) return <div>Loading...</div>;
  return (
    <main className='max-w-4xl mx-auto'>
      <div className='flex flex-col'>
        {data.age > 0 && <span>{data.age}</span>}
        <h1>{data.firstName}</h1>
        <p>{data.gym.name}</p>
        <p>{data.bio}</p>
      </div>
      <UserProfileProgress user={data} />
    </main>
  );
}
