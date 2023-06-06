import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase'; // your path to firebase config
import { useRootNavigationState, useRouter } from 'expo-router';
import { User } from '../types/user';

const useAuthState = () => {
  const navigationState = useRootNavigationState();

  const [user, setUser] = React.useState<null | User>(null);
  const [authUser, setAuthUser] = React.useState<null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setAuthUser(authUser as any);

      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const user = docSnap.data() as User;
          if (user.authStep === 'complete') {
            // If the user has completed the auth process, then redirect to the home page
            router.replace('/');
          }
          if (user.authStep !== 'complete') {
            switch (user.authStep) {
              case 'name':
                router.replace('/inputName');
                break;
              case 'age':
                router.replace('/inputAge');
                break;
              case 'gender':
                router.replace('/inputGender');
                break;
              case 'picture':
                router.replace('/inputPicture');
                break;
              case 'gym':
                router.replace('/inputGym');
                break;
              default:
                router.replace('/signin');
                break;
            }
          }
          setUser(user);
          console.log('User data:', user);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // Set loading to false after the user data has been fetched
    });

    return unsubscribe;
  }, [navigationState?.key]);

  return { authUser, user, loading };
};

export default useAuthState;
