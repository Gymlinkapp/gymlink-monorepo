import React from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { User } from '../../types/user';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, PaperPlaneRight } from 'phosphor-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/auth';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [message, setMessage] = React.useState('');
  const { user: currUser } = useAuth();
  const createChat = async () => {
    if (!currUser) return;
    const chatRef = doc(db, 'chats', `${user.uid}-${currUser.uid}`);

    await setDoc(chatRef, {
      users: [user.uid, currUser.uid],
      messages: [
        {
          sender: currUser.uid,
          createdAt: serverTimestamp(),
          content: message,
        },
      ],
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 125 : 20}
      style={{ flex: 1 }}
    >
      <MotiView
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 5,
            height: 5,
          },
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        from={{ opacity: 0, translateX: 300 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
        className='bg-dark-500'
      >
        <View className='w-full h-[70%] overflow-hidden rounded-2xl justify-end'>
          <Image
            source={{ uri: user.image }}
            className='w-full h-full absolute top-0 left-0'
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.25)']}
            style={{
              zIndex: 10,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
            }}
          />

          {/* user info */}
          <View className='z-20 p-8'>
            <View className='flex-row items-center'>
              {/* name & age */}
              <Text className='text-white font-akira-expanded mr-4 text-lg'>
                {user.name}
              </Text>
              <View className='bg-dark-300 p-2 px-2 rounded-full overflow-hidden'>
                <Text className='text-white '>{user.age}</Text>
              </View>
            </View>

            {/* location */}
            <View className='flex-row items-center'>
              <MapPin size={20} color='white' />
              <Text className='text-white'>{user.gym.description}</Text>
            </View>

            {/* their gym plans */}
            <View className='pt-4'>
              <View className='rounded-full w-1/2 px-4 py-2 bg-dark-300'>
                <Text className='text-white text-xs'>Going today @ 2:30PM</Text>
              </View>

              <View className='flex flex-row flex-wrap'>
                {['Chest', 'Triceps', 'Shoulders'].map((i) => (
                  <View className='rounded-full px-4 py-2 bg-light-500 mt-2 mx-1'>
                    <Text className='text-dark-500 text-xs'>{i}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        {/* start a chat */}
        <View className='w-full flex-row items-center z-20 mt-4'>
          <TextInput
            placeholder={`Lift with ${user.name}, get big 💪`}
            value={message}
            onChangeText={setMessage}
            placeholderTextColor='white'
            className='bg-dark-400 p-4 flex-1 rounded-md text-light-400'
          />
          <PaperPlaneRight
            size={24}
            color='white'
            weight='fill'
            style={{
              paddingHorizontal: 32,
            }}
          />
        </View>
      </MotiView>
    </KeyboardAvoidingView>
  );
};
