'use client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function FindGymLocationModal() {
  const router = useRouter();
  const [nearGyms, setNearGyms] = useState([]);
  const [enteredGymLocation, setEnteredGymLocation] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [selectedGym, setSelectedGym] = useState<SelectedGymAndLatLong | null>(
    JSON.parse(localStorage.getItem('selectedGym') || 'null') || null
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

  const handleGymSelection = () => {
    localStorage.setItem('selectedGym', JSON.stringify(selectedGym));
    router.push('/onboarding/2-sign-in');
  };

  return (
    <main className='h-screen overflow-hidden grid place-items-center bg-dark-500'>
      <div className='border-dark-400 rounded-xl border-1 p-12 flex flex-col gap-4 max-w-sm md:max-w-xl'>
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
                  longitude: number;
                  latitude: number;
                  gymAddress: string;
                  icon_background_color: string;
                  photos: { photo_reference: string }[];
                }) => (
                  <div
                    onClick={() => {
                      setSelectedGym({
                        gym: {
                          longitude: gym.longitude,
                          latitude: gym.latitude,
                          placeId: gym.place_id,
                          name: gym.description,
                          photos: gym.photos,
                          theme: gym.icon_background_color,
                          adddress: gym.gymAddress,
                        },
                        longitude: gym.longitude,
                        latitude: gym.latitude,
                      });
                      setEnteredGymLocation(gym.description);
                      setNearGyms([]);
                    }}
                    key={gym.place_id}
                    className='p-6 relative overflow-hidden hover:bg-dark-400 border-b-1 border-dark-400 rounded-xl cursor-pointer flex flex-col md:flex-row justify-between items-center'
                  >
                    <div className='absolute inset-0 bg-dark-500/75 z-10'></div>
                    {gym.photos?.length > 0 && (
                      <Image
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${gym?.photos[0]?.photo_reference}&key=AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA`}
                        alt='gym photo'
                        className='object-cover w-full h-full z-0'
                        fill
                      />
                    )}
                    <h4 className='truncate flex-1 max-w-full z-20'>
                      {gym.description}
                    </h4>
                    {gym.members > 0 ? (
                      <span className='ml-4 bg-dark-400 px-4 py-2 rounded-full text-xs z-20'>
                        Members: {gym.members}
                      </span>
                    ) : (
                      <span className='ml-4 bg-dark-400 px-4 py-2 rounded-full text-xs z-20'>
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
              onClick={handleGymSelection}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
