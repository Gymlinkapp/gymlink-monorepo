import { Text, View } from 'react-native';

export default function OnboardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className='py-6'>
      <Text className='text-light-500 text-2xl font-akira-expanded'>
        {title}
      </Text>
      <Text className='text-light-400'>{subtitle}</Text>
    </View>
  );
}
