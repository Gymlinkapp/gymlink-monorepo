import { User } from '@prisma/client';
import { createContext } from 'react';

const UserContext = createContext<User | null>(null);

export default UserContext;
