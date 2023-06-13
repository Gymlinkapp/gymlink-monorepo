import { Check, Prohibit, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { blockUser } from '../../../utils/blockUser';
import Loading from '../Loading';
import { db } from '../../../firebase';
import { useRouter } from 'expo-router';
import { User } from '../../../types/user';

type ModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  chatId: string;
};

export default function ChatActionsModal({
  isModalVisible,
  setIsModalVisible,
  chatId,
}: ModalProps) {
  //   const [isGoingToday, setIsGoingToday] = useState(false);

  const { user } = useCurrentUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) return;
  //   const userId = user.uid;

  //   const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
  //     const data = doc.data();

  //     if (!data) return;
  //     setGymPlans(data.gymPlans);
  //   });

  //   // Remember to unsubscribe from your real-time listener when your component is unmounted
  //   // or if the user logs out
  //   return () => unsubscribe();
  // }, [user]); // re-run effect when 'user' changes

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      const data = doc.data();

      if (!data) return;
    });

    return () => unsubscribe();
  }, [user]);
  const deleteChat = async (chatId: string) => {
    if (!user) return;
    router.push('/chats');

    // remove the chat from current user
    await updateDoc(doc(db, 'users', user.uid), {
      chats: arrayRemove(chatId),
    });

    // delete the chat for the rest of the users
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    const chatData = chatDoc.data();
    if (!chatData) return;
    const chatUsers = chatData.users.filter(
      (member: string) => member !== user.uid
    );

    // remove the chat from all other users
    Promise.all(
      chatUsers.map(async (uid: string) => {
        await updateDoc(doc(db, 'users', uid), {
          chats: arrayRemove(chatId),
        });
      })
    );

    // delete the chat document
    await deleteDoc(doc(db, 'chats', chatId));
    setIsModalVisible(false);
  };

  if (!user) return <Loading />;

  return (
    <Modal
      visible={isModalVisible}
      animationType='slide'
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View className='flex-1 justify-end items-end w-full'>
        <View className='bg-dark-500 border-1 border-dark-400 w-full h-1/2 p-12 rounded-3xl'>
          <View className='m-2 flex-row items-center w-full justify-between'>
            <Text className='text-white text-md font-akira-expanded'>
              Chat Actions
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <X color='#fff' />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                deleteChat(chatId);
              }}
              className='rounded-md py-6 flex-row items-center'
            >
              <Prohibit size={24} color='#fff' />
              <Text className='text-light-500 text-xl font-bold pl-4'>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
