import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { User } from '../types/user';
import { auth, db } from '../firebase';

export function useCurrentUser() {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);

        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as User);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }

          setLoading(false);
        });

        // Return cleanup function for snapshot listener
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    // Return cleanup function for auth state change listener
    return () => unsubscribeAuth();
  }, []);

  return { user, loading, isLoggedIn };
}
