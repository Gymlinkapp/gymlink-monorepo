'use client';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { AppleLogo, PaperPlaneTilt, Plus } from '@phosphor-icons/react';
import InitialExploreModal from '@/components/InitialExploreModal';
import PromptModal from '@/components/PromptModal';
import useGetMostRecentPrompt from '@/hooks/useGetMostRecentPrompt';
import useGetUserByEmail from '@/hooks/useGetUserByEmail';
import syncDailyPrompt from '@/utils/syncDailyPrompt';
import CreatePost from '@/components/CreatePost';
import useAllPosts from '@/hooks/usePosts';
import SkeletonPosts from '@/components/skeletonPosts';
import PromptCountdown from '@/components/PromptCountdown';
import type { Post } from '@/utils/post';
import PostCard from '@/components/Post';
import Banner from '@/components/Banner';
import axios from 'axios';

type Input = {
  token: string;
  gym: {
    name: string;
    latitude: number;
    longitude: number;
  };
  authSteps: number;
  longitude: number;
  latitude: number;
};

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [nearGyms, setNearGyms] = useState([]);
  const [enteredGymLocation, setEnteredGymLocation] = useState('');

  const autoCompleteGymLocations = async (input: string) => {
    // const apiKey = process.env.GOOGLE_API_KEY;
    const long = -82.96550771080275;
    const lat = 51.507351;
    if (input === '') {
      setNearGyms([]);
      return;
    }
    try {
      const res = await axios.get(
        `/api/autocompleteGymLocations?input=${input}`,
        {
          method: 'GET',
          headers: {},
        }
      );
      console.log(res.data);
      setNearGyms(res.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      {/* <Banner /> */}
      <main className='h-screen overflow-hidden grid place-items-center bg-dark-500'>
        <div className='border-dark-400 rounded-xl border-1 p-12 flex flex-col gap-4'>
          <div>
            <h2 className='text-xl font-medium'>
              What is the main gym you go to?
            </h2>
            <p className='text-light-400'>
              Choose your main gym and join your gym’s community.
            </p>
          </div>
          <div>
            <input
              onChange={(e) => {
                setEnteredGymLocation(e.target.value);
                autoCompleteGymLocations(e.target.value);
              }}
              value={enteredGymLocation}
              type='text'
              placeholder='Find your gym'
              className='input input-bordered w-full bg-transparent'
            />
            {nearGyms.length > 0 && (
              <div className='z-10 w-full bg-dark-500 rounded-b-xl border-1 border-t-0 flex flex-col gap-2 border-dark-400'>
                {nearGyms.map(
                  (gym: { place_id: string; description: string }) => (
                    <div
                      key={gym.place_id}
                      className='p-2 hover:bg-dark-400 border-b-1 border-dark-400 rounded-xl cursor-pointer'
                    >
                      {gym.description}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
