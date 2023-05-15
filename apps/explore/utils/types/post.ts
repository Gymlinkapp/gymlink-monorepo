export type Post = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  tags: typeof PostTag;
};

// @ts-expect-error - TODO: fix this
export const PostTag: {
  ADVICE: 'ADVICE';
  QUESTION: 'QUESTION';
  GENERAL: 'GENERAL';
};
