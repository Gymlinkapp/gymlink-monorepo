import { Check, Prohibit, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { blockUser } from '../../../utils/blockUser';
import Loading from '../Loading';

type ModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  blockedUserId: string;
};

export default function UserActionsModal({
  isModalVisible,
  setIsModalVisible,
  blockedUserId,
}: ModalProps) {
  //   const [isGoingToday, setIsGoingToday] = useState(false);

  const { user } = useCurrentUser();

  //   useEffect(() => {
  //     if (!user) return;
  //     const userId = user.uid;

  //     const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
  //       const data = doc.data();

  //       if (!data) return;
  //       setGymPlans(data.gymPlans);
  //     });

  //     // Remember to unsubscribe from your real-time listener when your component is unmounted
  //     // or if the user logs out
  //     return () => unsubscribe();
  //   }, [user]); // re-run effect when 'user' changes

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
              User Actions
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
                blockUser(user, blockedUserId);
              }}
              className='rounded-md py-6 flex-row items-center'
            >
              <Prohibit size={24} color='#fff' />
              <Text className='text-light-500 text-xl font-bold pl-4'>
                Block
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
