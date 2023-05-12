'use client';
import { SkeletonPost } from '@/components/skeletonPosts';
import usePost from '@/hooks/usePost';
import { Post } from '@/utils/post';
import { ArrowLeft } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const PostHeader = ({ post }: { post: Post }) => {
  return (
    <div className='flex justify-between items-center w-full'>
      <div className='flex items-center gap-2'>
        <div className='w-12 h-12 rounded-full overflow-hidden relative'>
          <Image
            src={post.user?.images[0] || '/init-modal-bg.png'}
            className='object-cover w-full h-full'
            alt={`${post.user.firstName} profile picture`}
            fill
            sizes='50%'
          />
        </div>
        <h3 className='text-xl'>{post.user.firstName}</h3>
      </div>
      <span className='text-sm text-dark-300'>
        {new Date(post.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>
  );
};

export default function Page({ params }: { params: { postId: string } }) {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { post, loading } = usePost(refreshKey, params.postId);
  if (loading || !post) {
    return (
      <div className='max-w-5xl mx-auto mt-12'>
        <SkeletonPost />
      </div>
    );
  }
  return (
    <main className='max-w-5xl mx-auto min-h-screen bg-dark-500'>
      <div className='w-full py-6'>
        <Link href='/'>
          <ArrowLeft size={24} className='text-light-500' />
        </Link>
      </div>
      <div className='w-full p-12 border-[0.5px] border-dark-400 rounded-xl flex flex-col gap-4'>
        <PostHeader post={post} />
        <div>
          <p className='text-light-400'>{post.content}</p>
        </div>
      </div>
      <div className='mt-12 flex flex-col gap-4 px-12'>
        {post.comments.map((comment) => (
          <div key={comment.id} className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <div className='w-12 h-12 rounded-full overflow-hidden relative'>
                <Image
                  src={comment.user?.images[0] || '/init-modal-bg.png'}
                  className='object-cover w-full h-full'
                  alt={`${comment.user.firstName} profile picture`}
                  fill
                  sizes='50%'
                />
              </div>
              <h3 className='text-xl'>{comment.user.firstName}</h3>
            </div>
            <p className='text-light-400'>{comment.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
