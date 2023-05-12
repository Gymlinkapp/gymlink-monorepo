import { useEffect, useState } from 'react';
import { User } from './useGetUserByEmail';
import { Post } from '@/utils/post';

const usePost = (refreshKey: number, postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/getPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: postId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPost(data.post as Post);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [refreshKey]);

  return { post, loading };
};

export default usePost;
