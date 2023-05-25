import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
    <div className='form-control'>
      <label className='label cursor-pointer'>
        <span className='label-text mr-2'>{label}</span>
        <input
          type='checkbox'
          name={name}
          className='checkbox'
          onClick={(e) => {
            onCheck(e as any);
          }}
        />
      </label>
    </div>
  );
};

const TextInput = ({
  label,
  placeholder,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: any) => void;
}) => {
  console.log(value);
  return (
    <div className='form-control w-full max-w-xs'>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <input
        type='text'
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='input input-bordered w-full max-w-xs'
      />
    </div>
  );
};

export default function BasicsPage() {
  const [interests, setInterests] = useState([]);
  const [city, setCity] = useState('');
  const [inputImages, setInputImages] = useState<string[]>([]);
  const [age, setAge] = useState(18);
  const [uploadingImageLoading, setUploadingImageLoading] = useState(false);
  console.log('interests', interests);
  console.log('city', city);
  console.log('inputImages', inputImages);
  const router = useRouter();
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

  //   const mutation = useMutation(() => {}), {
  //     onSuccess: () => {
  //       if (user) {
  //         router.push(`/user/${user.id}`);
  //       }
  //       // Handle successful mutation, e.g., show a success notification
  //     },
  //     onError: (error) => {
  //       // Handle error, e.g., show an error notification
  //       console.log(error);
  //     },
  //   })

  if (!user) return <div>Loading...</div>;
  return (
    <main className='h-screen grid place-items-center bg-dark-500'>
      <div className='border-1 border-dark-400 rounded-xl p-12'>
        <div className='mb-6'>
          <h1 className='font-medium text-2xl'>How do you stay active</h1>
          <p className='text-light-400'>
            Enter information here and see others who might have the same
            interests.
          </p>
        </div>
        <div>
          <div className='flex gap-2'>
            <div>
              <div>
                <h4>Interests</h4>
                <div className='grid grid-cols-3 gap-2'>
                  <InterestCheckbox label='Gym' name='gym' onCheck={onCheck} />
                  <InterestCheckbox label='Jog' name='jog' onCheck={onCheck} />
                  <InterestCheckbox
                    label='Walk'
                    name='walk'
                    onCheck={onCheck}
                  />
                  <InterestCheckbox
                    label='Swim'
                    name='swim'
                    onCheck={onCheck}
                  />
                  <InterestCheckbox
                    label='Yoga'
                    name='yoga'
                    onCheck={onCheck}
                  />
                </div>
              </div>
              <TextInput
                label='City'
                name='city'
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextInput
                label='Age'
                name='age'
                placeholder='Age'
                value={age.toString()}
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
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
              <div className='grid grid-cols-2 mt-6'>
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
          <button className='btn btn-primary w-full mt-6' onClick={() => {}}>
            Next
          </button>
        )}
      </div>
    </main>
  );
}
