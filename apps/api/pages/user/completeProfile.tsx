import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const UserSchema = z.object({
  age: z.number().min(1, 'Age must be at least 1'),
  bio: z.string().min(1, 'Bio must be at least 1 character long'),
  images: z.array(z.string().url('Must be a valid URL')),
});

type SubmissionData = z.infer<typeof UserSchema> & {
  userId: User['userId'];
};

// Define your mutation function outside the component
const updateUserProfile = async (payload: SubmissionData) => {
  const { data } = await axios.post('/api/users/update', payload);
  return data;
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const [age, setAge] = useState<number>(18);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      age: 18,
      bio: '',
      images: [],
    },
  });

  const { user } = useUser();

  const mutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      if (user) {
        router.push(`/user/${user.id}`);
      }
      // Handle successful mutation, e.g., show a success notification
    },
    onError: (error) => {
      // Handle error, e.g., show an error notification
      console.log(error);
    },
  });

  const onSubmit = () => {
    if (isNaN(parseInt(age as unknown as string, 10))) {
      // handle invalid age value
      return;
    }

    if (!user) return;

    mutation.mutate({
      userId: user.id,
      age: age,
      bio: getValues('bio'),
      images: inputImages,
    });
  };
  const [inputImages, setInputImages] = useState<string[]>([]);
  console.log(inputImages);

  if (!user) return <div>Loading...</div>;

  return (
    <main className='mx-auto max-w-5xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-2'>
          <div className='flex-1'>
            <div className='mb-4'>
              <label>Your age</label>
              <input
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                value={age}
                type='number'
                className='input input-bordered w-full'
              />
              {errors.age && (
                <p className='text-red-500'>{errors.age.message?.toString()}</p>
              )}
            </div>
            <div className='mb-4'>
              <label>Your bio</label>
              <textarea
                {...register('bio')}
                className='textarea textarea-bordered w-full'
              />
              {errors.bio && (
                <p className='text-red-500'>{errors.bio.message?.toString()}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
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
              {errors.images && (
                <p className='text-red-500'>
                  {errors.images.message?.toString()}
                </p>
              )}
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
        <button type='submit' className='btn btn-primary'>
          Save Changes
        </button>
      </form>
    </main>
  );
}
