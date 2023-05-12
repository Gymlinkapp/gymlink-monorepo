import { User } from '@/hooks/useGetUserByEmail';

export type Post = {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    images: string[];
  };
  updatedAt: Date;
  content: string;
  userId: string;
  comments: {
    id: string;
    createdAt: Date;
    user: User;
    updatedAt: Date;
    content: string;
    userId: string;
    postId: string;
  }[];
  likes: [];
  views: [];
  tags: typeof PostTag;
};

export let PostTag: {
  ADVICE: 'ADVICE';
  QUESTION: 'QUESTION';
  GENERAL: 'GENERAL';
};
