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
import { Stack, useRouter } from 'expo-router';
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
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import OnboardHeader from '../../components/ui/OnboardHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const StyledPlus = styled(Plus);

export default function InputPicture() {
  const [image, setImage] = useState('');
  const { user } = useCurrentUser();
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
      const storageRef = ref(storage, `users/${user?.uid}/profile.jpg`);

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
    if (!user) {
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', user.uid),
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
    <SafeAreaView className='bg-dark-500 h-full'>
      <Stack.Screen
        options={{
          title: 'Choose Image',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back} text='Back' />
          ),
        }}
      />
      <View className='p-6 flex-1 justify-between'>
        <OnboardHeader
          title='How ppl see you'
          subtitle='Show the progress, the best of the best lighting?'
        />
        <View className='items-center flex-col justify-between'>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 300, height: 325 }}
              className='rounded-2xl'
            />
          )}
          {image && (
            <TouchableOpacity
              className='bg-light-500 w-full py-6 rounded-md items-center mt-32'
              onPress={saveImageToUser}
            >
              <Text className='text-dark-500 font-akira-expanded'>
                Looks good, Continue
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!image && (
          <View>
            <TouchableOpacity
              className='bg-light-500 w-full py-6 rounded-md items-center mt-32'
              onPress={pickImage}
            >
              <Text className='text-dark-500 font-akira-expanded'>
                Pick an Image
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
