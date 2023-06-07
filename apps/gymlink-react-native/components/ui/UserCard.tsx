import React from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { User } from '../../types/user';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <MotiView
    style={{
      shadowColor: '#000',
      shadowOffset: {
        width: 5,
        height: 5,
      },
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    <View className='w-full h-[70%] overflow-hidden rounded-2xl'>
      <Image source={{ uri: user.image }} className='w-full h-full' />
    </View>
    <Text className='text-white'>{user.name}</Text>
  </MotiView>
);
