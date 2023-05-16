import { FinalUser } from '@/types/user';
import { User } from '@prisma/client';
import Link from 'next/link';

type Props = {
  user: FinalUser;
};

export default function ProfileCompletionBanner({ user }: Props) {
  const calculateCompletion = (user: FinalUser) => {
    const images = user.images as string[];
    let completedFields = 0;
    const totalFields = 3; // age, images, bio

    if (!user) return 0;
    if (user.age > 0) completedFields++;
    if (user.images && images.length >= 1) completedFields++;
    if (!user.bio || user.bio.length > 0) completedFields++;

    return (completedFields / totalFields) * 100;
  };

  const completionPercentage = calculateCompletion(user);
  console.log(completionPercentage);
  console.log(user.age);
  return (
    <Link href='/user/completeProfile'>
      <div className='flex justify-between border-1 border-dark-400 rounded-xl p-12 w-full'>
        <div>
          <h3 className='font-medium text-3xl'>Finish your profile!</h3>
          <p className='text-light-400'>
            Let people know who you are in the community.
          </p>
        </div>

        <div
          className='radial-progress'
          // @ts-expect-error - css variable
          style={{ '--value': completionPercentage }}
        >
          {Math.floor(completionPercentage)}%
        </div>
      </div>
    </Link>
  );
}
