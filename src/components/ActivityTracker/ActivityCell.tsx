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
  const scale = useSharedValue(1);
  const glowBorderWidth = useSharedValue(0);
  const glowShadowOpacity = useSharedValue(0);

  const peakScale = cellSize <= 8 ? 2.2 : cellSize <= 32 ? 1.5 : 1.25;

  useEffect(() => {
    scale.value = withSequence(
      withSpring(peakScale, { damping: 4, stiffness: 400 }),
      withSpring(1, { damping: 8, stiffness: 180 })
    );
    glowBorderWidth.value = withSequence(
      withTiming(2, { duration: 80 }),
      withTiming(0, { duration: 820 })
    );
    glowShadowOpacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(0, { duration: 820 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
