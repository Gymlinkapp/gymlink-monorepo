import {
  Tabs,
  useLocalSearchParams,
  useRouter,
  useSearchParams,
} from 'expo-router';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { View } from 'moti';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
} from 'react-native';
import { db } from '../../firebase';
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Chat, Message } from '../../types/chat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CaretLeft, PaperPlaneRight } from 'phosphor-react-native';
import { User } from '../../types/user';
import { useAuth } from '../../context/auth';

interface MessageData extends Partial<Message> {
  roomName: string;
  roomId: string;
  content: string;
}

function ChatItem({ message, user }: { message: Message; user: User }) {
  const [isAuthor, setIsAuthor] = useState(false);
  useEffect(() => {
    setIsAuthor(message.sender === user.uid);
  }, []);
  const amIAuthor = (message: Message) =>
    message.sender === user.uid ? 'flex-row-reverse' : 'flex-row';
  return (
    <View className={`${amIAuthor(message)} my-2`}>
      <View className='bg-dark-400 p-4 min-w-[125px] max-w-[310px] rounded-3xl'>
        <View>
          {isAuthor ? (
            <Text className='text-sm text-light-400'>Me</Text>
          ) : (
            <Text className='text-sm text-light-400'>{message.sender}</Text>
          )}
        </View>
        <Text className='text-sm text-light-500'>{message.content}</Text>
      </View>
    </View>
  );
}

export default function ChatPage() {
  const {
    chatId,
    socket: sock,
    roomName,
    otherUserImage,
  } = useLocalSearchParams();
  const { user } = useAuth();

  const [chat, setChat] = useState<Chat | null>(null);
  const [socket, setSocket] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageData, setMessageData] = useState<MessageData>({
    roomName: roomName as string,
    roomId: chat?.uid as string,
    sender: user?.uid as string,
    content: '',
    createdAt: new Date().toUTCString(),
  });
  const [isTyping, setIsTyping] = useState<Boolean>(false);

  const flatListRef = useRef(null);

  const router = useRouter();

  console.log('chatId', chatId);

  useEffect(() => {
    if (chat && user) {
      setMessageData((messageData) => ({
        ...messageData,
        roomId: chat.uid,
        sender: user.uid,
      }));
    }
  }, [chat, user]);

  useEffect(() => {
    if (!chatId) {
      return; // you could handle this case differently if needed
    }

    const chatRef = doc(db, 'chats', chatId as string);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      const data = doc.data() as Chat;
      setChat(data);
      setMessages(data.messages);
    });

    return () => unsubscribe();
  }, [chatId]); // runs whenever chatId changes

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) {
        return; // you could handle this case differently if needed
      }
      try {
        const chatRef = doc(db, 'chats', chatId as string);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setChat(chatData as Chat);
        } else {
          console.log('No such chat!');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChat();
  }, [chatId]); // runs whenever chatId changes

  const sendMessage = async () => {
    if (!chatId) {
      return; // you could handle this case differently if needed
    }

    try {
      const chatRef = doc(db, 'chats', chatId as string);

      // Here, also update the createdAt property
      const currentMessage = {
        sender: user?.uid as string,
        content: messageData.content,
        createdAt: new Date().toUTCString(),
      };

      console.log(currentMessage);

      const updatedMessages = [...messages, currentMessage];
      setMessages(updatedMessages);

      // Now that the new message is included in messages, update the entire array in Firestore
      await updateDoc(chatRef, {
        messages: arrayUnion(currentMessage),
      });

      setMessageData((messageData) => ({
        ...messageData,
        content: '',
      }));
    } catch (error) {
      console.log(error);
    }
  };

  if (!chat) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className='flex-1 bg-dark-500'>
      <Tabs.Screen
        options={{
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <View className='py-16 px-4'>
        <TouchableOpacity
          className='flex-row items-center bg-secondaryDark justify-center rounded-full w-32 py-2'
          onPress={() => router.push('/chats')}
        >
          <CaretLeft color='#fff' weight='regular' />
          <Text className='text-white'>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/chats')}
          className='flex-row items-center mt-4'
        >
          {/* <Image
            source={{ uri: otherUserImage as string }}
            className='w-10 h-10 mr-2 rounded-full'
          /> */}
          <Text className='text-2xl text-light-500 font-akira-expanded'>
            {roomName}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        className='flex-1'
        behavior='padding'
        keyboardVerticalOffset={15}
      >
        <SafeAreaView className='flex-1 bg-primaryDark px-4'>
          <KeyboardAvoidingView behavior='height' className='flex-1'>
            {chat.messages?.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                data={chat.messages}
                onContentSizeChange={() =>
                  // @ts-expect-error -- flatlist type error
                  flatListRef.current.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  // @ts-expect-error -- flatlist type error
                  flatListRef.current.scrollToEnd({ animated: true })
                }
                renderItem={({ item }) => (
                  <ChatItem
                    message={item}
                    user={user as User}
                    key={item.sender}
                  />
                )}
                keyExtractor={(item) => item.content}
              />
            )}
            {isTyping && (
              <View className='flex-row my-2 p-4 bg-secondaryDark w-1/6 justify-center rounded-full'>
                <Text className='text-secondaryWhite leading-3 tracking-[2.5em] font-MontserratBold'>
                  ...
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
          <View className='flex-row items-center bg-primaryDark'>
            <View className='flex-1 mr-2'>
              <TextInput
                value={messageData.content}
                onChangeText={(text) =>
                  setMessageData({ ...messageData, content: text })
                }
                // onFocus={() => {
                //   navigation.setOptions({ tabBarVisible: false });

                //   typingIndicator(true);
                // }}
                // onBlur={() => {
                //   navigation.setOptions({ tabBarVisible: true });

                //   typingIndicator(false);
                // }}
                className='bg-dark-400 text-white p-4 rounded-md'
              />
            </View>
            {messageData.content.length > 0 && (
              <TouchableOpacity onPress={sendMessage}>
                <Text className='text-dark-500'>
                  <PaperPlaneRight color='#fff' weight='fill' />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
