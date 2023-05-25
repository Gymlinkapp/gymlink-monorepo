import { FinalUser } from '@/types/user';
import { User } from '@prisma/client';
import Link from 'next/link';

type Props = {
  user: FinalUser;
  completionPercentage: number;
};

export default function ProfileCompletionBanner({
  user,
  completionPercentage,
}: Props) {
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
