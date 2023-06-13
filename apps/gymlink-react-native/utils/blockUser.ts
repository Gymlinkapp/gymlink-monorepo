import { doc, setDoc } from 'firebase/firestore';
import { User } from '../types/user';
import { db } from '../firebase';

export const blockUser = async (blockingUser: User, blockedUserId: string) => {
  // create a new array of blocked users on the current user
  // store the blocked users id in the array
  // update the current user with the new array of blocked users
  if (!blockingUser) return;
  const blockedUsers = [...(blockingUser.blockedUsers || []), blockedUserId];

  try {
    await setDoc(
      doc(db, 'users', blockingUser.uid),
      { blockedUsers },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
};
