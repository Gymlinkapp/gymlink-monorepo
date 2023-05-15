import { supabase } from '@/utils/supabase';
import { User } from '@/utils/types/user';
import { Camera } from '@phosphor-icons/react';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  user: User;
};

type RequredUserFields = {
  age: number;
  bio: string;
  images: string[];
};

type OptionalUserFields = {
  gyms?: Gym[];
};
export default function UserProfileProgress({ user }: Props) {
  const { age, bio, images }: RequredUserFields = user;
  const { gyms }: OptionalUserFields = user;
  const [inputImages, setInputImages] = useState<string[]>([]);
  const [inputBio, setInputBio] = useState<string>('');
  const [inputAge, setInputAge] = useState<number>(18);

  const updateUserProfile = async () => {
    try {
      await axios.post('/api/updateUserProfile', {
        id: user.id,
        age: inputAge,
        bio: inputBio,
        images: inputImages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const hasAge = age > 0;
  const hasBio = bio.length > 0;
  const hasImages = images.length > 0;

  const progressValue = () => {
    if (hasAge && hasBio && hasImages) {
      return 100;
    } else if (hasAge && hasBio) {
      return 80;
    } else if (hasAge) {
      return 50;
    } else {
      return 0;
    }
  };

  if (progressValue() === 100) return null;

  return (
    <div className='border-1 border-dark-400 rounded-xl'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h2 className='text-xl font-medium'>Profile Progress</h2>
            <p>
              Create a better profile to let people know who you are in the
              community.
            </p>
          </div>
          <div
            className='radial-progress'
            // @ts-ignore
            style={{ '--value': progressValue() }}
          >
            {progressValue()}%
          </div>
        </div>
        <div className='flex gap-2'>
          <div className='flex flex-col gap2'>
            {!hasAge && (
              <div>
                <p>Age</p>
                <input
                  type='number'
                  max={80}
                  min={18}
                  defaultValue={18}
                  placeholder='Enter your age here'
                  onChange={(e) => setInputAge(parseInt(e.target.value))}
                  value={inputAge}
                  className='input input-bordered w-full max-w-lg'
                />
              </div>
            )}
            {!hasBio && (
              <div>
                <p>Bio</p>
                <textarea
                  onChange={(e) => setInputBio(e.target.value)}
                  value={inputBio}
                  className='textarea textarea-bordered w-full max-w-lg'
                  placeholder='Bio'
                ></textarea>
              </div>
            )}
          </div>
          <div>
            <p>Your gym pics</p>
            <input
              type='file'
              multiple
              onChange={async (e) => {
                const imgs = e.target.files;
                const images = imgs && Array.from(imgs);

                console.log(images);
                if (!images) return;
                // list through every FileList
                images.map(async (image) => {
                  const bucketPath = `user-${user.id}-${Math.random()}`;
                  const { data, error } = await supabase.storage
                    .from('user-images/public')
                    .upload(bucketPath, image, {
                      cacheControl: '3600',
                      upsert: false,
                    });

                  if (data) {
                    const url = supabase.storage
                      .from('user-images/public')
                      .getPublicUrl(bucketPath);
                    setInputImages((prev) => [...prev, url.data.publicUrl]);
                  }
                });
              }}
              className='file-input file-input-bordered w-full max-w-xs'
            />
            <div className='flex gap-2 flex-wrap'>
              {inputImages.length > 0 &&
                inputImages.map((image) => (
                  <div key={image} className='relative w-32 h-32'>
                    <Image src={image} fill alt='image' />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={updateUserProfile}
          className='btn btn-primary btn-block'
        >
          Save
        </button>
      </div>
    </div>
  );
}
