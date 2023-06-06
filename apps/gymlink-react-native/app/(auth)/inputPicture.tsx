import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import * as ImagePicker from 'expo-image-picker';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from 'firebase/storage';
import { Plus } from 'phosphor-react-native';
import { styled } from 'nativewind';

const StyledPlus = styled(Plus);

export default function InputPicture() {
  const [image, setImage] = useState('');
  const { authUser } = useAuth();
  const router = useRouter();

  const storage = getStorage();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        const asset = result.assets[0].uri;

        setImage(asset);
        uploadImage(asset);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, 'users/');

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can also include progress update
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImage(downloadURL); // Set the download URL to state
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveImageToUser = async () => {
    if (!authUser) {
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', authUser.uid),
        {
          image: image,
          authStep: 'gym',
        },
        { merge: true }
      );

      router.push('/inputGym');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  console.log(image);
  return (
    <SafeAreaView className='items-center flex-col justify-between flex-1 bg-dark-500'>
      <TouchableOpacity
        onPress={pickImage}
        className='bg-dark-300 py-6 px-12 items-center flex-row rounded-md'
      >
        <StyledPlus
          size={24}
          weight='bold'
          color='#fff'
          className='text-white'
        />
        <Text className='text-white font-bold'>Pick Image</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 300, height: 400 }}
          className='rounded-2xl'
        />
      )}
      {image && (
        <TouchableOpacity
          onPress={saveImageToUser}
          className='bg-dark-300 py-6 items-center rounded-md w-full'
        >
          <Text className='text-white font-bold'>Connect to your main gym</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
