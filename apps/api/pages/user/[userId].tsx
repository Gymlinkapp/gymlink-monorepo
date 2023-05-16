import ProfileCompletionBanner from '@/components/ProfileCompletionBanner';
import { useUserById } from '@/hooks/useGetUserById';
import { FinalUser } from '@/types/user';
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

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <main className='mx-auto max-w-5xl bg-dark-500'>
      <ProfileCompletionBanner user={user} />

      <div>
        <h1>{user.firstName}</h1>
        <p>{user.bio}</p>
      </div>
    </main>
  );
}
