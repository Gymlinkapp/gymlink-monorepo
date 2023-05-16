import { useUser } from '@clerk/nextjs';
import { Gym, User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

interface Input extends Partial<User> {
  gym?: Gym;
}
export default function Home() {
  const { user, isSignedIn } = useUser();

  const saveUserMutation = useMutation(
    (user: Input) => axios.post('/api/auth/baseWebAccount', user),
    {
      onSuccess: (data) => {
        if (data) {
          localStorage.setItem('isUserSavedInDB', 'true');
        }
      },
      onError: (error) => {
        console.error('Failed to save user to database:', error);
      },
    }
  );

  useEffect(() => {
    const isUserSavedInDB = localStorage.getItem('isUserSavedInDB');
    const gym = JSON.parse(localStorage.getItem('selectedGym') || '{}') as Gym;

    if (
      user &&
      isSignedIn &&
      gym &&
      (!isUserSavedInDB || isUserSavedInDB === 'false')
    ) {
      saveUserMutation.mutate({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        images: [user.profileImageUrl],
        gym,
        longitude: gym.longitude,
        latitude: gym.latitude,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>testt</div>;
}
