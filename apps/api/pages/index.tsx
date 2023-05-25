import PeopleSkeleton from '@/components/SkeletonLoadingPeople';
import UserContext from '@/contexts/UserContext';
import { useGetUser } from '@/hooks/useGetUser';
import { useGetAllUsers } from '@/hooks/useGetUsers';
import useSaveUser from '@/hooks/useSaveUser';
import wrapGooglePhotoRefernce from '@/lib/wrapGooglePhoto';
import { UserButton, useUser } from '@clerk/nextjs';
import { TwitterLogo } from '@phosphor-icons/react';
import Image from 'next/image';
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
  const { data: users } = useGetAllUsers();

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
  }, [user, clerkUser]);

  console.log('users', users);

  if (isLoading || !user) return <PeopleSkeleton />;

  return (
    <main className='mx-auto max-w-5xl p-6 md:p-16'>
      <header className='mb-20'>
        <nav className='flex items-center justify-between'>
          <h1 className='text-2xl md:text-4xl font-bold'>
            Home | Meet some active peeps
          </h1>
          <UserButton />
        </nav>
      </header>

      <ul className='grid grid-cols-1 md:grid-cols-2'>
        {users?.map((user) => (
          <li
            key={user.id}
            className='flex flex-col md:flex-row gap-2 border-1 border-dark-400 rounded-xl overflow-hidden hover:border-dark-300 cursor-pointer duration-200'
          >
            <div className='relative h-32 md:h-full w-full md:flex-1 overflow-hidden'>
              <Image
                // @ts-expect-error - wrong prisma type
                src={user.images[0] || '/init-modal-bg.png'}
                fill
                alt='image'
                className='object-cover'
                sizes='50%'
              />
            </div>
            <div className='flex flex-col p-6 md:flex-1'>
              <div className='flex items-center justify-between gap-2w-full'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-bold text-2xl'>{user.firstName}</h4>
                  <p>{user.city}</p>
                </div>
                {user.twitter && (
                  <a
                    target='_blank'
                    href={`https://twitter.com/${user.twitter}`}
                    className='hover:scale-150 duration-300'
                  >
                    <TwitterLogo
                      size={16}
                      weight='fill'
                      className='text-light-400'
                    />
                  </a>
                )}
              </div>
              <div className='mt-6'>
                <h5 className='text-light-400 font-bold'>
                  Favorite activities
                </h5>
                <ul>
                  {(user.interests as string[]).map((interest) => (
                    <li
                      className='border-1 border-dark-300 bg-dark-400 w-fit rounded-full px-4 py-1 text-xs leading-normal'
                      key={interest}
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
