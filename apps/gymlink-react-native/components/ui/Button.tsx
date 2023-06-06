import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export default function Button({ onPress, children }: ButtonProps) {
  return (
    <TouchableOpacity
      className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
      onPress={onPress}
    >
      <Text className='text-dark-500 font-akira-expanded'>{children}</Text>
    </TouchableOpacity>
  );
}
