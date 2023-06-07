import { Tabs } from 'expo-router';
import { ChatCircle, House, SignOut } from 'phosphor-react-native';
import { Text, TouchableOpacity } from 'react-native';
import { auth } from '../../../firebase';
import { View } from 'moti';

export default function Chats() {
  return (
    <View className='flex-1 bg-dark-500'>
      <Tabs.Screen
        options={{
          tabBarStyle: {
            backgroundColor: '#070707',
          },
          tabBarIcon: ({ focused }) => (
            <ChatCircle
              size={24}
              color='#fff'
              weight={focused ? 'fill' : 'bold'}
            />
          ),
          headerTitle: '',
          headerShown: true,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#070707',
          },
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
    </View>
  );
}
