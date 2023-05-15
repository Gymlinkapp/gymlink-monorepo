'use client';

import UserProfileProgress from '@/components/UserProfileProgress';
import { User } from '@/utils/types/user';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

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
    <main className='max-w-4xl mx-auto mb-52'>
      <UserProfileProgress user={data} />

      <div className='flex gap-2 items-center mt-20'>
        <div className='relative h-20 w-20 overflow-hidden rounded-full'>
          <Image
            alt='user image'
            src={data.images[0]}
            fill
            className='object-cover'
          />
        </div>
        <div>
          {data.age > 0 && <span>{data.age}</span>}
          <h1 className='text-3xl font-medium'>{data.firstName}</h1>
          <p>{data.gym.name}</p>
          <p>{data.bio}</p>
        </div>
      </div>
    </main>
  );
}
