'use client';
import useOnboardingStep from '@/hooks/useOnboardingStep';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';

type SelectedGymAndLatLong = {
  gym: {
    name: string;
    latitude: number;
    longitude: number;
  };
  longitude: number;
  latitude: number;
};

export default function FindGymLocationModal() {
  const { updateStep } = useOnboardingStep();
  const [nearGyms, setNearGyms] = useState([]);
  const [enteredGymLocation, setEnteredGymLocation] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [selectedGym, setSelectedGym] = useState<SelectedGymAndLatLong | null>(
    null
  );

  const autoCompleteGymLocations = async (input: string) => {
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
      console.log(res.data.predictions);
      setNearGyms(res.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };
  return (
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
          {nearGyms?.length > 0 && (
            <div className='z-10 w-full bg-dark-500 rounded-b-xl border-1 border-t-0 flex flex-col gap-2 border-dark-400'>
              {nearGyms.map(
                (gym: {
                  place_id: string;
                  description: string;
                  members: number;
                  photos: { photo_reference: string }[];
                }) => (
                  <div
                    onClick={() => {
                      setEnteredGymLocation(gym.description);
                      setNearGyms([]);
                    }}
                    key={gym.place_id}
                    className='p-2 hover:bg-dark-400 border-b-1 border-dark-400 rounded-xl cursor-pointer flex justify-between items-center'
                  >
                    <div className='flex flex-row gap-4 items-center'>
                      <div className='relative w-20 h-20 rounded-full overflow-hidden'>
                        <Image
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${gym?.photos[0]?.photo_reference}&key=AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA`}
                          alt='gym photo'
                          fill
                        />
                      </div>
                      <h4 className='truncate flex-1 max-w-lg'>
                        {gym.description}
                      </h4>
                    </div>

                    {gym.members > 0 ? (
                      <span className='ml-4 bg-dark-400 px-4 py-2 rounded-full text-xs'>
                        Members: {gym.members}
                      </span>
                    ) : (
                      <span className='ml-4 bg-dark-400 px-4 py-2 rounded-full text-xs'>
                        Join now
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {enteredGymLocation.length > 5 && (
          <div className='flex justify-end'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => {
                updateStep(2);
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
