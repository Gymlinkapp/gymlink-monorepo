import { SplashScreen, Tabs, useRouter } from 'expo-router';
import { ChatCircle, House, SignOut } from 'phosphor-react-native';
import { Text, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase';
import { View } from 'moti';
import { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { useAuth } from '../../context/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { Chat } from '../../types/chat';

const ChatItem = ({ item }: { item: Chat }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[] | []>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUsersInChat = async (chat: Chat): Promise<User[]> => {
    const chatUserIds = chat.users;
    let users: User[] = [];

    await Promise.all(
      chatUserIds.map(async (u) => {
        const userRef = doc(db, 'users', u);
        const userDoc = await getDoc(userRef);

        users.push(userDoc.data() as User);
      })
    );

    return users;
  };

  useEffect(() => {
    getUsersInChat(item)
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [item]);

  if (loading || !users) {
    return <Text>...loading</Text>; // Or some custom loading UI
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (!user) {
          return;
        }

        const otherUser = users.find((u) => u.uid !== user.uid);
        const slug = users.map((u) => u.name).join('-');
        router.push({
          pathname: `/chats/${slug}`,
          params: {
            chat: item,
            chatId: item.uid,
            roomName: slug,
          },
        });
      }}
    >
      <Text className='text-white'>{users[0]?.name}</Text>
      <Text className='text-white'>{item?.messages[0].content}</Text>
    </TouchableOpacity>
  );
};

export default function Chats() {
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [channelName, setChannelName] = useState('');
  const router = useRouter();

  const { authUser, user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      if (!authUser) {
        return <SplashScreen />;
      }
      try {
        const userId = authUser.uid;
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        const userChats = (userDoc.data() as User).chats;

        setChatIds(userChats);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, []); // dependency array is empty so this effect runs once on mount

  useEffect(() => {
    if (chatIds.length > 0) {
      getAllChats();
    }
  }, [chatIds]);

  const getAllChats = async () => {
    try {
      const chats = await Promise.all(
        chatIds.map(async (c) => {
          const chatRef = doc(db, 'chats', c);
          const chatDoc = await getDoc(chatRef);
          return chatDoc.data(); // replace with the necessary data structure if needed
        })
      );
      if (!chats) {
        return;
      }
      setChats(chats as Chat[]); // use a state hook to save the chats
    } catch (error) {
      console.log(error);
    }
  };

  function handleButtonPress(
    members: Array<{ id: number; displayName: string }>
  ) {}

  return (
    <View className='flex-1 bg-dark-500'>
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <ChatCircle
              size={24}
              color='#fff'
              weight={focused ? 'fill' : 'bold'}
            />
          ),
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: '#070707',
            borderBottomColor: '#070707',
          },
          tabBarStyle: {
            backgroundColor: '#070707',
            borderTopColor: '#070707',
          },
          headerTitle: '',
          headerShown: true,
          headerLeft: () => (
            <Text className='font-akira-expanded text-light-500'>Gymlink</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                auth.signOut();
                // router.push('/signin');
              }}
            >
              <SignOut size={24} color='#fff' weight='bold' />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatItem item={item} />}
        />
      </View>
    </View>
  );
}
