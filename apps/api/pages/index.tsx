import UserContext from '@/contexts/UserContext';
import { useGetUser } from '@/hooks/useGetUser';
import useSaveUser from '@/hooks/useSaveUser';
import wrapGooglePhotoRefernce from '@/lib/wrapGooglePhoto';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const {} = useSaveUser();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading } = useGetUser(
    clerkUser?.emailAddresses[0].emailAddress || ''
  );
  const router = useRouter();

  useEffect(() => {
    if (!user || !clerkUser) {
      router.push('/');
    }

    const userInterests = (user?.interests as string[]) || [];
    const userImages = (user?.images as string[]) || [];

    // if user is not onboarded, redirect to onboarding
    if (
      user &&
      (!user.city || userImages.length <= 0 || userInterests.length <= 0)
    ) {
      router.push('/onboarding/basics');
    }
  }, []);

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <main className='mx-auto max-w-5xl'>
      <h1 className='text-4xl font-bold'>Home | Your Main Gym</h1>
      <div>
        <Link href={`/gym/${user.gym.placeId}`}>
          <div
            className='bg-cover overflow-hidden rounded-3xl p-12 bg-no-repeat bg-center relative'
            style={{
              backgroundImage: `url(${wrapGooglePhotoRefernce(
                (user.gym.photos as any)[0].photo_reference
              )})`,
            }}
          >
            <div className='bg-gradient-to-t from-dark-500 to-dark-500/50 absolute inset-0' />
            <div className='relative flex flex-col gap-2'>
              <span className='bg-light-500 rounded-full px-4 py-2 text-dark-500 text-xs w-fit'>
                Members {user.gym.users.length}
              </span>
              <h2 className='font-medium text-3xl'>{user.gym.name}</h2>
              <p>{user.gym.address}</p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
