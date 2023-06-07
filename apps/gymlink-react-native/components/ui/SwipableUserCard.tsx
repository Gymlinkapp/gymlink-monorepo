// SwipeableUserCard.tsx
import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { clamp } from 'react-native-redash';
import { UserCard } from './UserCard';
import { User } from '../../types/user';
import { Dimensions, StyleSheet } from 'react-native';

interface SwipeableUserCardProps {
  user: User;
  onSwipe: (userId: string) => void;
}

export const SwipeableUserCard: React.FC<SwipeableUserCardProps> = ({
  user,
  onSwipe,
}) => {
  const translateX = useSharedValue(0);
  const windowWidth = useSharedValue(Dimensions.get('window').width);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX * 0.75 + ctx.startX; // Adjusted sensitivity
      }
    },
    onEnd: (event) => {
      if (event.velocityX < -1000) {
        translateX.value = withSpring(-windowWidth.value);
        runOnJS(onSwipe)(user.uid);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        // Make the card rotate to the left when swiped left
        { rotate: `${translateX.value * 0.00025}rad` },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, styles.card]}>
        <UserCard user={user} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
