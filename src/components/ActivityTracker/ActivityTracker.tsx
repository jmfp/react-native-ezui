import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native';
import type { ActivityTrackerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useCallback } from 'react';
import ActivityCell from './ActivityCell';
import { Button } from '../Button';
import { HabitIcon } from '../HabitIcon';
import * as Haptics from 'expo-haptics';
function getGridDates(days: number): { date: Date; key: string }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells: { date: Date; key: string }[] = [];
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

let COLS = 40;
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
}: ActivityTrackerProps) {
  const theme = useEzuiTheme();
  timeInterval == 'Month'
    ? (COLS = 15)
    : timeInterval == 'Week'
      ? (COLS = 7)
      : (COLS = 40);
  const gridDays = useMemo(() => {
    if (timeInterval === 'Week') return 7;
    if (timeInterval === 'Month') return 30;
    return 365;
  }, [timeInterval]);
  let cellSize = timeInterval == 'Month' ? 32 : timeInterval == 'Week' ? 64 : 8;
  let cellBorderRadius =
    timeInterval == 'Month' ? 9 : timeInterval == 'Week' ? 16 : 3;

  const gridCells = useMemo(() => getGridDates(gridDays), [gridDays]);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const key = toDayKey(today);
    if (completedSet.has(key) || localAdded.has(key)) {
      return;
    }
    setLocalAdded((prev) => new Set(prev).add(key));
    setNewlyCompletedKey(key);
    setTimeout(() => setNewlyCompletedKey(null), 30000);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          <Button
            variant={todayCompleted ? 'primary' : 'outline'}
            icon={
              <Ionicons
                name="checkmark-outline"
                size={16}
                color={todayCompleted ? theme.colors.text : color}
              />
            }
            color={color}
            onPress={handleAddCompletion}
            accessibilityLabel={
              todayCompleted ? 'Completed today' : 'Mark today complete'
            }
            style={styles.toolbarIconButton}
          />
        </View>
      </View>
      <View
        style={[styles.gridWrap, { backgroundColor: theme.colors.surface }]}
      >
        <FlatList
          data={gridCells}
          numColumns={COLS}
          scrollEnabled={false}
          keyExtractor={(item) => item.key}
          style={styles.flatList}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ActivityCell
              color={color}
              completed={isCompleted(item.key)}
              justCompleted={item.key === newlyCompletedKey}
              cellSize={cellSize}
              borderRadius={cellBorderRadius}
            />
          )}
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
