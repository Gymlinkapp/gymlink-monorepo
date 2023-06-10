import { Check, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

type GymPlanModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
};

type Movement = {
  label: string;
  value: string;
  selected: boolean;
};

export default function GymPlanModal({
  isModalVisible,
  setIsModalVisible,
}: GymPlanModalProps) {
  //   const [isGoingToday, setIsGoingToday] = useState(false);

  const { user } = useAuth();
  const [gymPlans, setGymPlans] = useState(null);

  const [items, setItems] = useState<Movement[]>([
    { label: 'Chest', value: 'chest', selected: false },
    { label: 'Back', value: 'back', selected: false },
    { label: 'Shoulders', value: 'shoulders', selected: false },
    { label: 'Biceps', value: 'biceps', selected: false },
    { label: 'Triceps', value: 'triceps', selected: false },
    { label: 'Legs', value: 'legs', selected: false },
  ]);

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      const data = doc.data();

      if (!data) return;
      setGymPlans(data.gymPlans);
    });

    // Remember to unsubscribe from your real-time listener when your component is unmounted
    // or if the user logs out
    return () => unsubscribe();
  }, [user]); // re-run effect when 'user' changes

  const saveGymPlans = async () => {
    if (!user) return;
    const userId = user.uid;
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    await setDoc(
      doc(db, 'users', userId),
      {
        gymPlans: [
          ...(userData?.gymPlans || []),
          {
            isGoingToday: true,
            movements: items.filter((item) => item.selected),
            date: new Date().toISOString(),
          },
        ],
      },
      { merge: true }
    );
  };

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
              Your gym plans
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <X color='#fff' />
            </TouchableOpacity>
          </View>
          <View className='flex-1'>
            {/* <View className='flex-row items-center'>
              <TouchableOpacity
                onPress={() => setIsGoingToday(!isGoingToday)}
                className={`${
                  isGoingToday ? 'bg-white' : 'bg-dark-300'
                } border-[1px] border-dark-300 rounded-md p-4 w-6 h-6 border-none text-white font-[MontserratMedium] justify-center items-center mr-2`}
              >
                {isGoingToday && <Check color='#070707' size={20} />}
              </TouchableOpacity>
              <Text className='text-white text-md'>
                Let people know I'm going to the gym today
              </Text>
            </View> */}
            <FlatList
              contentContainerStyle={{
                flex: 1,
                zIndex: 10,
                flexGrow: 1,
                paddingBottom: 50,
                height: '100%',
              }}
              numColumns={2}
              data={items}
              renderItem={({ index, item }) => (
                <TouchableOpacity
                  key={index}
                  className={`rounded-full m-2 px-6 py-2 z-10 ${
                    item.selected ? 'bg-light-500' : 'bg-dark-400'
                  }`}
                  onPress={() => {
                    const newItems = [...items];
                    newItems[index].selected = !newItems[index].selected;
                    setItems(newItems);
                  }}
                >
                  <View>
                    <Text
                      className={`${
                        item.selected ? 'text-dark-500' : 'text-light-500'
                      } text-center`}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <View>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  saveGymPlans();
                }}
                className='rounded-md bg-light-500 py-6 items-center'
              >
                <Text className='text-dark-500 text-md font-akira-expanded'>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
