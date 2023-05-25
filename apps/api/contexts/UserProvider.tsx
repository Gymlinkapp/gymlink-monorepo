import { useState, useEffect, ReactNode } from 'react';
import UserContext from './UserContext';
import useSaveUser from '../hooks/useSaveUser';
import { User } from '@prisma/client';

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const { savedUser } = useSaveUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (savedUser) {
      setUser(savedUser);
    }
  }, [savedUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
