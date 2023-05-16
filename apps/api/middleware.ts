import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  beforeAuth: () => false,
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
