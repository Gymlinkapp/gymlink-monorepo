import ProfileCompletionBanner from '@/components/ProfileCompletionBanner';
import { useUserById } from '@/hooks/useGetUserById';
import { FinalUser } from '@/types/user';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function UserPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user, isLoading } = useUserById(userId as string);
  console.log(user);

  // full user account completion progress
  // age
  // images
  // bio

  const calculateCompletion = (user: FinalUser) => {
    const images = user?.images as string[];
    let completedFields = 0;
    const totalFields = 3; // age, images, bio

    if (!user) return 0;
    if (user.age > 0) completedFields++;
    if (user.images && images.length >= 1) completedFields++;
    if (!user.bio || user.bio.length > 0) completedFields++;

    return (completedFields / totalFields) * 100;
  };

  const completionPercentage = calculateCompletion(user as FinalUser);

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <main className='mx-auto max-w-5xl bg-dark-500'>
      {completionPercentage < 100 && (
        <ProfileCompletionBanner
          user={user}
          completionPercentage={completionPercentage}
        />
      )}
      <div className='flex flex-col'>
        <div className='relative h-24 w-24 overflow-hidden rounded-xl'>
          <Image
            alt={`${user.firstName} main photos`}
            // @ts-expect-error - images is not undefined
            src={user.images[0]}
            className='object-cover'
            fill
          />
        </div>
        <div>
          <h1>{user.firstName}</h1>
          <p>{user.bio}</p>
        </div>
      </div>
    </main>
  );
}
