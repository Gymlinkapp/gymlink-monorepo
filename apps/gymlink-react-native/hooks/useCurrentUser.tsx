import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { User } from '../types/user';
import { auth, db } from '../firebase';

export function useCurrentUser() {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data() as User);
          setIsLoggedIn(true); // User is logged in if the user object exists
        }
      } else {
        setUser(null);
        setIsLoggedIn(false); // User is not logged in if there's no user object
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log({ user, loading, isLoggedIn });

  return { user, loading, isLoggedIn };
}
