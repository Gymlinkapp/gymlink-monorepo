import { signInWithEmailAndPassword } from 'firebase/auth/react-native';
import { auth } from '../firebase';

export function useSignIn() {
  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  return signIn;
}
