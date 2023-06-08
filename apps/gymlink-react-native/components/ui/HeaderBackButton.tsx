import { CaretLeft } from 'phosphor-react-native';
import { Text, TouchableOpacity } from 'react-native';

interface HeaderBackButtonProps {
  router: () => void;
  text: string;
}

export default function HeaderBackButton({
  router,
  text,
}: HeaderBackButtonProps) {
  return (
    <TouchableOpacity
      className='text-light-500 flex-row items-center'
      onPress={router}
    >
      <CaretLeft size={24} color='#fff' />
      <Text className='text-light-500'>{text}</Text>
    </TouchableOpacity>
  );
}
