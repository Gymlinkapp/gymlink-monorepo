import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth/react-native';
import { app, auth, db } from '../firebase';
import { User } from '../types/user';
import { signOut, User as AuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextInterface {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  authUser: AuthUser | null;
  user: User | null;
}

const AuthContext = React.createContext<AuthContextInterface>({} as any);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const navigationState = useRootNavigationState();

  const [user, setUser] = React.useState<null | User>(null);
  const [authUser, setAuthUser] = React.useState<null | AuthUser>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  // useProtectedRoute(user);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setAuthUser(authUser as AuthUser | null);

      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data() as User);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // Set loading to false after the user data has been fetched
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    // If the user has completed the auth process, then redirect to the home page
    if (user) {
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
    }
  }, [user, user?.authStep, navigationState?.key]);

  // While the user status is loading, you can return a loading screen or null.
  if (loading) {
    return null;
  }

  console.log(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          await signInWithEmailAndPassword(auth, email, password);
        },
        signOut: async () => {
          await signOut(auth);
        },
        authUser,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
