import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';

export default function InputName() {
  const [name, setName] = useState('');
  const { authUser } = useAuth();
  const router = useRouter();

  const chooseName = async () => {
    if (!authUser) {
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', authUser.uid),
        {
          name: name,
          authStep: 'age',
        },
        { merge: true }
      );

      router.push('/inputAge');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };
  return (
    <View className='justify-center flex-1 bg-dark-500'>
      <TextInput
        className='bg-dark-400 px-2 py-6 rounded-md text-white'
        placeholder='Christopher Bumsted'
        onChangeText={setName}
        value={name}
        autoComplete='name'
        textContentType='name'
      />
      <Button title='Done' onPress={chooseName} />
    </View>
  );
}
