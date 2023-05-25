import { useGym } from '@/hooks/useGetGym';
import wrapGooglePhotoRefernce from '@/lib/wrapGooglePhoto';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function GymPage() {
  const router = useRouter();
  const { placeId } = router.query;

  const { data: gym, isLoading } = useGym(placeId as string);

  console.log(gym);

  if (isLoading || !gym) return <div>Loading...</div>;

  return (
    <div>
      <div className='relative w-full h-[25vh] rounded-b-3xl overflow-hidden flex flex-col justify-end p-12'>
        <div className='absolute inset-0 bg-dark-500/50 z-10' />
        <Image
          alt={`${gym.name} main photos`}
          src={wrapGooglePhotoRefernce((gym.photos as any)[0].photo_reference)}
          fill
          className='object-cover'
        />

        <div className='relative flex flex-col gap-2 z-20'>
          <span className='bg-light-500 rounded-full px-4 py-2 text-dark-500 text-xs w-fit'>
            Members {gym.users?.length}
          </span>
          <h2 className='font-medium text-3xl'>{gym.name}</h2>
          <p>{gym.address}</p>
        </div>
      </div>
      <main className='mx-auto max-w-5xl flex md:flex-row flex-col-reverse p-6'>
        <div className='flex-1'>
          <h2 className='font-medium text-2xl'>Anncounments</h2>
        </div>
        <div className='flex-[0.25] flex justify-between flex-row-reverse md:flex-col gap-4 md:items-end'>
          <button className='btn btn-primary'>Join</button>

          <div className=''>
            <h4 className='font-medium text-xl text-right'>
              Get to know active members
            </h4>
            <button className='btn btn-secondary'>
              <Link href={`/gym/${gym.placeId}/members`}>See all</Link>
            </button>
            <ul className='grid grid-rows-2 grid-cols-3'>
              {gym.users?.slice(0, 6).map((user) => (
                <li
                  className='bg-cover overflow-hidden rounded-3xl p-4 bg-no-repeat bg-center relative flex'
                  style={{
                    // @ts-expect-error - wrong prisma json type
                    backgroundImage: `url(${user.images[0] || ''})`,
                  }}
                  key={user.id}
                >
                  <Link href={`/user/${user.id}`}>
                    <div className='absolute bg-dark-500/25 inset-0' />
                    <div className='relative'>
                      <span>{user.age}</span>
                      <h5 className='text-lg font-medium'>{user.firstName}</h5>
                      <p>{user.lastName}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
