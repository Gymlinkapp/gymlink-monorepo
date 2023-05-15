import { Post } from '../post';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gym: Gym;
  age: number;
  images: string[];
  posts: Post[];
  bio: string;
  gyms: Gym[];
};
