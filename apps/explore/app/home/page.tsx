'use client';
import MainNavbar from '@/components/MainNavbar';
import { formatGymNameToSlug } from '@/utils/formatGymNameToSlug';
import { SelectedGymAndLatLong } from '@/utils/types/misc';
import wrapGooglePhotoRefernce from '@/utils/wrapGooglePhotoReference';
import { UserButton, useUser, SignInButton, useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Input = {
  baseWebAccount?: boolean;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  images?: string[];
  gym: {
    id?: string;
    name: string;
    latitude: number;
    theme: string;
    longitude: number;
    adddress: string;
    photos: { photo_reference: string }[];
    placeId: string;
  };
  longitude: number;
  latitude: number;
};

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [savedToDb, setSavedToDb] = useState(false);
  const [gyms, setGyms] = useState<Gym[] | []>([]);

  const getGyms = async () => {
    if (user) {
      try {
        const res = await axios.post(`/api/getAllGyms`, {
          email: user.emailAddresses[0].emailAddress,
        });
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('savedToDb');
    if (saved) {
      setSavedToDb(JSON.parse(saved));
    }
  }, []);

  const saveUserInDb = async () => {
    const { gym }: SelectedGymAndLatLong = JSON.parse(
      localStorage?.getItem('selectedGym') || '{}'
    );
    if (user && isSignedIn && !savedToDb) {
      try {
        await axios.post('/api/createUserInDb', {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          images: [user.profileImageUrl],
          gym: {
            name: gym.name,
            theme: gym.theme,
            latitude: gym.latitude,
            longitude: gym.longitude,
            adddress: gym.adddress,
            photos: gym.photos,
            placeId: gym.placeId,
          },
          longitude: gym.longitude,
          latitude: gym.latitude,
        } as Input);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    saveUserInDb();
    localStorage.setItem('savedToDb', 'true');
    setSavedToDb(localStorage.getItem('savedToDb') === 'true');
  }, [user, isSignedIn, savedToDb]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['hydrate-gyms'],
    enabled: !!user,
    queryFn: () => getGyms(),
  });

  if (isLoading || isFetching || !data) {
    return <h4>loading..</h4>;
  }

  console.log(user?.profileImageUrl);

  return (
    <div className='mt-20 max-w-3xl mx-auto'>
      <ul>
        {data?.gyms?.map((gym: Gym) => (
          <li
            key={gym.placeId}
            className={`w-full p-12 relative bg-cover bg-center bg-no-repeat rounded-xl border-1 border-dark-400 hover:border-light-400/50 hover:brightness-125 hover:saturate-150 duration-300 ease-in-out overflow-hidden cursor-pointer`}
            style={{
              backgroundImage: `url(${wrapGooglePhotoRefernce(
                gym.photos[0]?.photo_reference
              )})`,
            }}
          >
            <Link href={`/gym/${gym.placeId}`}>
              <div className='z-20 relative'>
                <h4 className='text-xl font-medium'>{gym.name}</h4>
              </div>
              <div className='absolute inset-0 z-0 bg-gradient-to-t from-dark-500 to-dark-500/25'></div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
