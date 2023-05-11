import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  beforeAuth: () => false,
});

// Stop Middleware running on static files
export const config = {
  matcher: '/((?!_next/image|_next/static|favicon.ico).*)',
};
