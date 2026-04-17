import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native';
import type { ActivityTrackerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import ActivityCell from './ActivityCell';
import { Button } from '../Button';
import { HabitIcon } from '../HabitIcon';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
type GridCell = { date: Date | null; key: string };

function getGridDates(days: number): GridCell[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells: GridCell[] = [];
  const count = Math.max(1, Math.floor(days));
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    cells.push({ date: d, key });
  }
  return cells;
}

function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function normalizeDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d;
}

const GAP = 2;

export default function ActivityTracker({
  dates = [],
  onAddCompletion: _onAddCompletion,
  color,
  icon,
  name,
  timeInterval = 'Year',
  onTitlePress,
  headerActions,
  completionNavigator,
  hideCompletionControl = false,
  padYearGridToFullRows = false,
}: ActivityTrackerProps) {
  const theme = useEzuiTheme();
  const { numCols, gridDays, cellSize, cellBorderRadius } = useMemo(() => {
    if (timeInterval === 'Week') {
      return { numCols: 7, gridDays: 7, cellSize: 64, cellBorderRadius: 16 };
    }
    if (timeInterval === 'Month') {
      return { numCols: 15, gridDays: 30, cellSize: 32, cellBorderRadius: 9 };
    }
    return { numCols: 40, gridDays: 365, cellSize: 8, cellBorderRadius: 3 };
  }, [timeInterval]);

  const gridCells = useMemo(() => {
    const base = getGridDates(gridDays);
    if (padYearGridToFullRows && timeInterval === 'Year') {
      const cells = [...base];
      while (cells.length % numCols !== 0) {
        cells.push({ date: null, key: `pad-${cells.length}` });
      }
      return cells;
    }
    return base;
  }, [gridDays, numCols, padYearGridToFullRows, timeInterval]);

  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (const d of dates) {
      const date = normalizeDate(d);
      if (!isNaN(date.getTime())) set.add(toDayKey(date));
    }
    return set;
  }, [dates]);

  const [localAdded, setLocalAdded] = useState<Set<string>>(new Set());
  const [newlyCompletedKey, setNewlyCompletedKey] = useState<string | null>(
    null
  );
  const handleAddCompletion = useCallback(() => {
    if (!_onAddCompletion) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const key = toDayKey(today);
    if (completedSet.has(key) || localAdded.has(key)) {
      return;
    }
    setLocalAdded((prev) => new Set(prev).add(key));
    setNewlyCompletedKey(key);
    setTimeout(() => setNewlyCompletedKey(null), 30000);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    _onAddCompletion(today);
  }, [_onAddCompletion, completedSet, localAdded]);

  const isCompleted = useCallback(
    (key: string) => completedSet.has(key) || localAdded.has(key),
    [completedSet, localAdded]
  );

  const todayCompleted = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isCompleted(toDayKey(today));
  }, [isCompleted]);

  const accent = color ?? theme.colors.primary;
  const pressPopScale = useSharedValue(1);
  const completeProgress = useSharedValue(todayCompleted ? 0 : 1);
  const completionPressShrunkRef = useRef(false);
  const completionInitRef = useRef(false);
  useEffect(() => {
    if (!completionInitRef.current) {
      completeProgress.value = todayCompleted ? 0 : 1;
      completionInitRef.current = true;
      return;
    }
    completeProgress.value = withTiming(todayCompleted ? 0 : 1, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [todayCompleted]);

  const completionButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completeProgress.value,
      [0, 1],
      [accent, 'transparent']
    );
    const borderWidth = interpolate(completeProgress.value, [0, 1], [0, 2]);
    const shadowOpacity = interpolate(completeProgress.value, [0, 1], [0.25, 0]);
    const elevation = interpolate(completeProgress.value, [0, 1], [5, 0]);
    return {
      transform: [{ scale: pressPopScale.value }],
      backgroundColor,
      borderWidth,
      borderColor: accent,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity,
      shadowRadius: 3.84,
      elevation,
    };
  });

  const onCompletionPressIn = useCallback(() => {
    completionPressShrunkRef.current = true;
    pressPopScale.value = withTiming(0.88, {
      duration: 55,
      easing: Easing.out(Easing.quad),
    });
  }, [pressPopScale]);

  const onCompletionPressOut = useCallback(() => {
    if (!completionPressShrunkRef.current) {
      return;
    }
    completionPressShrunkRef.current = false;
    pressPopScale.value = withSequence(
      withSpring(1.15, { damping: 10, stiffness: 620, mass: 0.3 }),
      withSpring(1, { damping: 15, stiffness: 400, mass: 0.42 })
    );
  }, [pressPopScale]);

  const iconLayerBase = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const completionIconPrimaryStyle = useAnimatedStyle(() => ({
    ...iconLayerBase,
    opacity: 1 - completeProgress.value,
  }));

  const completionIconOutlineStyle = useAnimatedStyle(() => ({
    ...iconLayerBase,
    opacity: completeProgress.value,
  }));

  const body = (
    <View style={styles.outerWrap}>
      <View style={[styles.title, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.activityInforSection}>
          <HabitIcon icon={icon} size={24} color={theme.colors.text} />
          <View style={styles.titleTextWrap}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: theme.colors.text, backgroundColor: theme.colors.surface }}
            >
              {name}
            </Text>
          </View>
        </View>
        <View style={styles.titleActionCluster}>
          {headerActions?.map((action) => (
            <Button
              key={action.key}
              variant={action.variant ?? 'outline'}
              color={color}
              icon={action.icon}
              onPress={action.onPress}
              accessibilityLabel={action.accessibilityLabel}
              style={styles.toolbarIconButton}
            />
          ))}
          {!hideCompletionControl ? (
            completionNavigator ? (
              <Button
                variant="outline"
                color={accent}
                icon={
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={accent}
                  />
                }
                onPress={completionNavigator.onPress}
                accessibilityLabel={
                  completionNavigator.accessibilityLabel ??
                  'Open completion history'
                }
                style={styles.toolbarIconButton}
              />
            ) : (
              <Pressable
                onPress={handleAddCompletion}
                onPressIn={onCompletionPressIn}
                onPressOut={onCompletionPressOut}
                accessibilityRole="button"
                accessibilityLabel={
                  todayCompleted ? 'Completed today' : 'Mark today complete'
                }
                style={styles.toolbarIconButton}
              >
                <Animated.View
                  style={[
                    styles.completionButtonFace,
                    completionButtonStyle,
                  ]}
                >
                  <View style={styles.completionIconStack}>
                    <Animated.View style={completionIconPrimaryStyle}>
                      <Ionicons
                        name="checkmark-outline"
                        size={16}
                        color={theme.colors.text}
                      />
                    </Animated.View>
                    <Animated.View style={completionIconOutlineStyle}>
                      <Ionicons
                        name="checkmark-outline"
                        size={16}
                        color={accent}
                      />
                    </Animated.View>
                  </View>
                </Animated.View>
              </Pressable>
            )
          ) : null}
        </View>
      </View>
      <View
        style={[styles.gridWrap, { backgroundColor: theme.colors.surface }]}
      >
        <FlatList
          data={gridCells}
          numColumns={numCols}
          scrollEnabled={false}
          keyExtractor={(item) => item.key}
          style={styles.flatList}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) =>
            item.date ? (
              <ActivityCell
                color={color}
                completed={isCompleted(item.key)}
                justCompleted={item.key === newlyCompletedKey}
                cellSize={cellSize}
                borderRadius={cellBorderRadius}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  maxWidth: cellSize,
                  maxHeight: cellSize,
                  opacity: 0,
                }}
              />
            )
          }
        />
      </View>
    </View>
  );

  if (onTitlePress) {
    return <Pressable onPress={onTitlePress}>{body}</Pressable>;
  }

  return body;
}

const styles = StyleSheet.create({
  gridWrap: {
    width: '100%',
    padding: 8,
    paddingBottom: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'visible',
  },
  flatList: {
    overflow: 'visible',
  },
  activityInforSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  titleTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: GAP,
    overflow: 'visible',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
    overflow: 'visible',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleActionCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  toolbarIconButton: {
    width: 50,
    height: 50,
    padding: 0,
    borderRadius: 16,
  },
  completionButtonFace: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  completionIconStack: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  outerWrap: {
    overflow: 'visible',
  },
  dateContainer: {
    borderRadius: 2,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 8,
    maxHeight: 8,
    borderRadius: 2,
  },
});
