import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { GenericData } from '@/types/GenericData';

type Data = {} & GenericData;

type Input = {
  userId?: string;
  email?: string;
  promptId: string;
  answer: string;
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
  const input = req.body as Input;
  if (input.answer.length === 0) {
    return res.status(400).json({ error: 'Answer cannot be empty' });
  }
  console.log(input);
  try {
    let user;
    if (input.userId) {
      user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          userPrompts: true,
        },
      });
    } else if (input.email) {
      user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
        include: {
          userPrompts: true,
        },
      });
    }

    if (!user) throw new Error('User not found');
    if (user.userPrompts.find((prompt) => prompt.promptId === input.promptId))
      throw new Error('User already answered this prompt');

    const prompt = await prisma.prompt.findUnique({
      where: {
        id: input.promptId,
      },
    });

    if (!prompt) throw new Error('Prompt not found');

    const userPrompt = await prisma.userPrompt.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        prompt: {
          connect: {
            id: prompt.id,
          },
        },
        answer: input.answer,
        hasAnswered: true,
      },
    });

    return res.status(200).json({ userPrompt });
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
}
