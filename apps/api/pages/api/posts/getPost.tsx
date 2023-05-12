import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type Input = {
  postId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle the OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    const input = req.body as Input;

    const post = await prisma.post.findUnique({
      where: {
        id: input.postId,
      },
      include: {
        likes: true,
        views: true,
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                images: true,
              },
            },
          },
        },

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gym: true,
            images: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
}
