import { useGym } from '@/hooks/useGetGym';
import Layout from '@/layouts/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function GymMembersPage() {
  const router = useRouter();
  const { placeId } = router.query;
  const { data: gym, isLoading } = useGym(placeId as string);

  if (isLoading || !gym) return <div>Loading...</div>;

  return (
    <Layout title={`${gym.name} Members`} back={`/gym/${gym.placeId}`}>
      <ul>
        {gym.users?.map((user) => (
          <li key={user.id} className='flex gap-2 items-center'>
            <div>
              <Image
                // @ts-expect-error - wrong prisma json type
                src={user.images[0]}
                alt={user.firstName}
                width={50}
                height={50}
              />
            </div>
            <div>
              <h4>{user.firstName}</h4>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
