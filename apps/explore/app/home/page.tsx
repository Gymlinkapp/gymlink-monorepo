'use client';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Input = {
  baseWebAccount?: boolean;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gym: {
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

type SelectedGymAndLatLong = {
  gym: {
    name: string;
    theme: string;
    latitude: number;
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
  }, [user, isSignedIn]);
  return (
    <div className=''>
      {isSignedIn && <UserButton />}
      {!isSignedIn && <SignInButton mode='modal'>Sign in</SignInButton>}
      <h1>hi</h1>
    </div>
  );
}
