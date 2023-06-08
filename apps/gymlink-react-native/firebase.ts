import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA',
  authDomain: 'gymlink.firebaseapp.com',
  projectId: 'gymlink',
  storageBucket: 'gymlink.appspot.com',
  messagingSenderId: '316576697387',
  appId: '1:316576697387:web:b584835bc7f38ce5f3ae6e',
  measurementId: 'G-FFBS83W2BH',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  // popupRedirectResolver: () => {
  //   return Promise.resolve({
  //     // Make sure this matches the `redirect_uri` parameter in your API config.
  //     url: 'https://www.example.com/__/auth/handler',
  //   });
  // },
});

// const storage = getStorage(app);

export { app, auth, db };
