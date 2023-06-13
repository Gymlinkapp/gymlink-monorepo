import React, { useState } from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { MotiView } from 'moti';
import { User } from '../../types/user';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DotsThree,
  MapPin,
  PaperPlaneRight,
  Prohibit,
} from 'phosphor-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { findUsersPlansToday } from '../../utils/findUsersGymPlansForToday';
import UserFeedActionsModal from './modals/UserFeedActions';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [message, setMessage] = useState('');
  const [isUserFeedActionsModalVisible, setIsUserFeedActionsModalVisible] =
    useState(false);
  const { user: currUser } = useCurrentUser();
  const router = useRouter();

  const createChat = async () => {
    if (!currUser) return;
    const chatRef = doc(db, 'chats', `${user.uid}-${currUser.uid}`);

    try {
      const chat = await setDoc(chatRef, {
        uid: chatRef.id,
        users: [user.uid, currUser.uid],
        messages: [
          {
            sender: currUser.uid,
            createdAt: new Date(),
            content: message,
          },
        ],
      });

      // Get current user's document and add the chat ID to their 'chats' field.
      const currentUser = doc(db, 'users', currUser.uid);
      const userSnap = await getDoc(currentUser);
      let userChats = (userSnap.data() as User).chats || []; // get current chats or initialize with empty array if null
      if (!chatRef.id) {
        throw new Error('Chat ID not found');
      }

      const chatRefId = chatRef.id as never;

      // if there is already a chat with this user, don't add it again
      if (userChats.includes(chatRefId)) {
        router.push('/chats');
        return;
      }
      userChats.push(chatRefId);

      await updateDoc(currentUser, {
        chats: userChats,
      });

      // Get other user's document and add the chat ID to their 'chats' field.
      const otherUser = doc(db, 'users', user.uid);
      const otherUserSnap = await getDoc(otherUser);
      let otherUserChats = (otherUserSnap.data() as User).chats || []; // get current chats or initialize with empty array if null
      if (!chatRef.id) {
        throw new Error('Chat ID not found');
      }

      // if there is already a chat with this user, don't add it again
      if (otherUserChats.includes(chatRefId)) {
        router.push('/chats');
        return;
      }

      otherUserChats.push(chatRefId);

      await updateDoc(otherUser, {
        chats: otherUserChats,
      });

      router.push('/chats');
    } catch (error) {
      console.log('Error creating chat:', error);
    }
  };
  if (!currUser)
    return (
      <View className='w-full h-[70%] overflow-hidden rounded-2xl justify-end bg-dark-400 animate-pulse'></View>
    );

  let todayPlan = findUsersPlansToday(currUser.gymPlans);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 125 : 20}
      style={{ flex: 1 }}
    >
      <UserFeedActionsModal
        blockedUserId={user.uid}
        isModalVisible={isUserFeedActionsModalVisible}
        setIsModalVisible={setIsUserFeedActionsModalVisible}
      />
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
        <View className='w-full h-[70%] overflow-hidden rounded-2xl justify-between'>
          <View className='w-full flex-row justify-end z-40'>
            <TouchableOpacity
              className='p-4'
              onPress={() =>
                setIsUserFeedActionsModalVisible(!isUserFeedActionsModalVisible)
              }
            >
              <DotsThree size={30} color='white' />
            </TouchableOpacity>
          </View>
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
            {/* if a user has gym plans today [{date: string}] */}
            {todayPlan && (
              <View className='flex-row items-center'>
                {user.gymPlans &&
                  todayPlan.movements.map((movement) => (
                    <View
                      key={movement.label}
                      className='rounded-full px-4 py-2 bg-light-500 mt-2 mx-1'
                    >
                      <Text className='text-dark-500 text-xs'>
                        {movement.label}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
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
          {message.length > 0 && (
            <TouchableOpacity onPress={createChat}>
              <PaperPlaneRight
                size={24}
                color='white'
                weight='fill'
                style={{
                  paddingHorizontal: 32,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </MotiView>
    </KeyboardAvoidingView>
  );
};
