import { Tabs, useRouter } from 'expo-router';
import {
  Chat,
  ChatCircleDots,
  House,
  HouseLine,
  SignOut,
  User,
} from 'phosphor-react-native';
import { Text, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: '#070707',
            borderBottomColor: '#070707',
          },
          tabBarStyle: {
            backgroundColor: '#070707',
            borderTopColor: '#070707',
          },
          tabBarIcon: ({ focused }) => (
            <House size={24} color='#fff' weight={focused ? 'fill' : 'bold'} />
          ),
          headerTitle: '',
          headerShown: true,

          headerLeft: () => (
            <Text className='font-akira-expanded text-light-500'>Gymlink</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                auth.signOut();
                router.push('/signin');
              }}
            >
              <SignOut size={24} color='#fff' weight='bold' />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name='chats'
        options={{
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: '#070707',
            borderBottomColor: '#070707',
          },
          tabBarStyle: {
            backgroundColor: '#070707',
            borderTopColor: '#070707',
          },
          tabBarIcon: ({ focused }) => (
            <ChatCircleDots
              size={24}
              color='#fff'
              weight={focused ? 'fill' : 'bold'}
            />
          ),
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
      <Tabs.Screen
        name='profile'
        options={{
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: '#070707',
            borderBottomColor: '#070707',
          },
          tabBarStyle: {
            backgroundColor: '#070707',
            borderTopColor: '#070707',
          },
          tabBarIcon: ({ focused }) => (
            <User size={24} color='#fff' weight={focused ? 'fill' : 'bold'} />
          ),
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
    </Tabs>
  );
}
