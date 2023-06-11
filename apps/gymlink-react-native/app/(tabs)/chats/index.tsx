import { SplashScreen, Tabs, useRouter } from 'expo-router';
import { ChatCircle, House, SignOut } from 'phosphor-react-native';
import { Image, Text, TouchableOpacity } from 'react-native';
import { auth, db } from '../../../firebase';
import { View } from 'moti';
import { useEffect, useState } from 'react';
import { User } from '../../../types/user';
import { useAuth } from '../../../context/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { Chat } from '../../../types/chat';
import Loading from '../../../components/ui/Loading';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const ChatItem = ({ item }: { item: Chat }) => {
  const { user } = useCurrentUser();
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
    return <Loading />; // Or some custom loading UI
  }

  const otherUser = users.find(
    (u) => u.uid !== user?.uid || u.name !== user?.name
  );
  console.log(
    'users',
    users.map((u) => u.name)
  );
  console.log('otherUser', otherUser);
  const lastMessage = item.messages[item.messages.length - 1];

  return (
    <TouchableOpacity
      onPress={() => {
        if (!user) {
          return;
        }

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
      <View className='flex-row items-center bg-dark-400 p-6 rounded-lg my-2'>
        <View className='w-12 h-12 overflow-hidden rounded-full'>
          <Image source={{ uri: otherUser?.image }} className='h-full w-full' />
        </View>
        <View className='ml-4'>
          <Text className='text-white font-akira-expanded text-lg'>
            {otherUser?.name}
          </Text>
          <Text className='text-light-400'>{lastMessage.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Chats() {
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [channelName, setChannelName] = useState('');
  const router = useRouter();

  const { user } = useCurrentUser();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        return <Loading />;
      }
      try {
        const userId = user.uid;
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        const userChats = (userDoc.data() as User).chats;

        setChatIds(userChats);
        console.log(userChats);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [user]); // dependency array is empty so this effect runs once on mount

  useEffect(() => {
    if (chatIds?.length > 0) {
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
      <View>
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatItem item={item} />}
        />
      </View>
    </View>
  );
}
