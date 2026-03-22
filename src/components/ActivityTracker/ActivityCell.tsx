import type { ActivityCellProps } from './types';
import { View, StyleSheet } from 'react-native';
import { memo, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const PlainCell = memo(function PlainCell({
  color,
  completed,
  cellSize,
  borderRadius,
}: Omit<ActivityCellProps, 'justCompleted'>) {
  return (
    <View
      style={[
        styles.cell,
        {
          backgroundColor: color,
          opacity: completed ? 1 : 0.2,
          maxHeight: cellSize,
          maxWidth: cellSize,
          borderRadius,
        },
      ]}
    />
  );
});

const AnimatedCelebrationCell = memo(function AnimatedCelebrationCell({
  color,
  cellSize,
  borderRadius,
}: Omit<ActivityCellProps, 'justCompleted' | 'completed'>) {
  const yPosition = useSharedValue(0);
  const glowBorderWidth = useSharedValue(0);
  const glowShadowOpacity = useSharedValue(0);
  const rotation = useSharedValue(2);

  useEffect(() => {
    yPosition.value = withSequence(
      withSpring(7, { damping: 8, stiffness: 520, mass: 0.8 }),
      withSpring(1.5, { damping: 14, stiffness: 420, mass: 0.9 }),
      withSpring(12, { damping: 10, stiffness: 1500, mass: 0.8 }),
      withSpring(0, { damping: 18, stiffness: 260, mass: 1.1 })
    );
    rotation.value = withSequence(
      withTiming(0.5, { duration: 1200 }),
      withTiming(-1, { duration: 1800 }),
      withTiming(0, { duration: 1800 })
    );
    glowBorderWidth.value = withSequence(
      withTiming(2, { duration: 80 }),
      withTiming(1, { duration: 80 }),
      withTiming(2, { duration: 80 }),
      withTiming(1, { duration: 80 }),
      withTiming(2, { duration: 80 }),
      withTiming(0, { duration: 820 })
    );
    glowShadowOpacity.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 820 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -yPosition.value },
      { rotate: `${rotation.value * 360}deg` },
    ],
    borderWidth: glowBorderWidth.value,
    borderColor: color,
    shadowOpacity: glowShadowOpacity.value,
    shadowColor: color,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: glowShadowOpacity.value * 14,
  }));

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          backgroundColor: color,
          opacity: 1,
          maxHeight: cellSize,
          maxWidth: cellSize,
          borderRadius,
        },
        animatedStyle,
      ]}
    />
  );
});

const ActivityCell = memo(function ActivityCell({
  color,
  completed,
  justCompleted,
  cellSize,
  borderRadius,
}: ActivityCellProps) {
  if (justCompleted) {
    return (
      <AnimatedCelebrationCell
        color={color}
        cellSize={cellSize}
        borderRadius={borderRadius}
      />
    );
  }
  return (
    <PlainCell
      color={color}
      completed={completed}
      cellSize={cellSize}
      borderRadius={borderRadius}
    />
  );
});

export default ActivityCell;

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 8,
    maxHeight: 8,
    borderRadius: 2,
  },
});
