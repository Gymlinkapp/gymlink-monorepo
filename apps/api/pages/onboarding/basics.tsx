import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { MouseEvent, useState } from 'react';

const InterestCheckbox = ({
  label,
  onCheck,
  name,
}: {
  name: string;
  label: string;
  onCheck: (e: MouseEvent<HTMLInputElement, MouseEvent>) => void;
}) => {
  return (
    <div className='flex items-center'>
      <input
        name={name}
        type='checkbox'
        onClick={(e) => {
          onCheck(e as any);
        }}
      />
      <p>{label}</p>
    </div>
  );
};

export default function BasicsPage() {
  const [interests, setInterests] = useState([]);
  const [city, setCity] = useState('');
  const [inputImages, setInputImages] = useState<string[]>([]);
  const [age, setAge] = useState(18);
  const [uploadingImageLoading, setUploadingImageLoading] = useState(false);
  const { user } = useUser();
  const onCheck = (e: MouseEvent<HTMLInputElement, MouseEvent>) => {
    // @ts-ignore -- e.target.name & e.target.checked
    if (e.target.checked) {
      // @ts-ignore
      setInterests([...interests, e.target.name]);
    } else {
      // @ts-ignore
      setInterests(interests.filter((interest) => interest !== e.target.name));
    }
  };

  if (!user) return <div>Loading...</div>;
  return (
    <main className='h-screen grid place-items-center bg-dark-500'>
      <div className='border-1 border-dark-400 rounded-xl p-12'>
        <div>
          <h1 className='font-medium text-2xl'>How do you stay active</h1>
          <p className='text-light-400'>Sign up to see the dashboard</p>
        </div>
        <div>
          <div className='flex gap-2'>
            <div>
              <div>
                <h4>Interests</h4>
                <div className='flex items-center gap-2'>
                  <InterestCheckbox label='Gym' name='jog' onCheck={onCheck} />
                  <InterestCheckbox label='Jog' name='jog' onCheck={onCheck} />
                  <InterestCheckbox
                    label='Yoga'
                    name='yoga'
                    onCheck={onCheck}
                  />
                </div>
              </div>
              <div>
                <h4>City</h4>
                <input
                  onChange={(e) => setCity(e.target.value)}
                  type='text'
                  name='city'
                />
              </div>
              <div>
                <h4>Age</h4>
                <input
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  defaultValue={age}
                  type='number'
                  name='age'
                />
              </div>
            </div>
            <div>
              <div className='flex flex-col'>
                <label>Your gym pics</label>
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

                      if (!data) setUploadingImageLoading(true);

                      if (data) {
                        setUploadingImageLoading(false);
                        const url = supabase.storage
                          .from('user-images/public')
                          .getPublicUrl(bucketPath);
                        setInputImages((prev) => [...prev, url.data.publicUrl]);
                      }
                    });
                  }}
                  className='file-input file-input-bordered w-full max-w-xs'
                />
              </div>
              <div className='grid grid-cols-2'>
                {inputImages.length > 0 &&
                  inputImages.map((image) => (
                    <div
                      key={image}
                      className='relative flex-1 h-32 overflow-hidden rounded-xl'
                    >
                      <Image
                        src={image}
                        fill
                        alt='image'
                        className='object-cover'
                        sizes='50%'
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {uploadingImageLoading && <p>Uploading image...</p>}
        {interests.length > 0 && city.length > 0 && inputImages.length > 0 && (
          <button onClick={() => {}}>Next</button>
        )}
      </div>
    </main>
  );
}
