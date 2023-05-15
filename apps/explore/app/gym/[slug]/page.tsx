import wrapGooglePhotoRefernce from '@/utils/wrapGooglePhotoReference';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

async function getGym(placeId: string) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gyms/getById`,
      {
        placeId,
      }
    );
    return res.data.gym;
  } catch (error) {
    console.log(error);
  }
}

export default async function GymPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log(params);

  const gym = await getGym(params.slug);
  console.log(gym);

  return (
    <main className='max-w-5xl mx-auto mt-8'>
      <div className='mb-4'>
        <Link href='/home' className='btn btn-secondary'>
          Back
        </Link>
      </div>
      <div
        className={`w-full h-[25vh] relative bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden `}
        style={{
          backgroundImage: `url(${wrapGooglePhotoRefernce(
            gym.photos[0]?.photo_reference
          )})`,
        }}
      >
        {/* <div className='absolute inset-0 bg-gradient-to-t from-dark-500 to-dark-500/50' /> */}
      </div>
      <div className='flex justify-between items-center py-6'>
        <div>
          <h1 className='text-2xl font-medium'>{gym?.name}</h1>
          <p>{gym?.address}</p>
          <span>{gym?.users?.length}</span>
        </div>
        <div>
          <button className='btn btn-primary'>Join</button>
        </div>
      </div>
      <div className='flex'>
        <div className='flex-1'>
          <h2 className='text-xl font-medium'>Annoucements</h2>
          <ul>
            <li>
              <p>Annoucement 1</p>
            </li>
          </ul>
        </div>
        <div className='flex-[0.5] flex gap-2 justify-end'>
          {gym?.users?.map((user: any) => (
            <>
              <div key={user.id} className='relative p-4 flex-1'>
                <Image
                  src={user.images[0]}
                  alt={user.firstName}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-dark-500 to-dark-500/50' />
                <div className='relative z-10 h-20 flex flex-col justify-end'>
                  <p>{user.age}</p>
                  <p>{user.firstName}</p>
                  {/* <p>{user.split[0]}</p> */}
                </div>
              </div>
              <div key={user.id} className='relative p-4 flex-1 '>
                <Image
                  src={user.images[0]}
                  alt={user.firstName}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-dark-500 to-dark-500/50' />
                <div className='relative z-10 h-20 flex flex-col justify-end'>
                  <p>{user.age}</p>
                  <p>{user.firstName}</p>
                  {/* <p>{user.split[0]}</p> */}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </main>
  );
}
