import { UserPrompt } from '@/hooks/useGetUserByEmail';

export default function syncDailyPrompt(
  promptId: string,
  userPrompts: UserPrompt[]
) {
  if (!userPrompts) return null;
  return userPrompts.find((prompt) => prompt.promptId === promptId);
}
