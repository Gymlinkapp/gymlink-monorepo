import { View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function Loading() {
  return (
    <View className='flex-1 h-full w-full justify-center items-center bg-dark-500'>
      <Progress.Circle
        size={50}
        indeterminate={true}
        color='#fff'
        shouldRasterizeIOS
      />
    </View>
  );
}
