import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { ActivityTrackerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { useMemo, useState, useCallback } from 'react';
import ActivityCell from './ActivityCell';
import { Button } from '../Button';
import { HabitIcon } from '../HabitIcon';

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

/** Plain YYYY-MM-DD must not use new Date(str) — that is UTC midnight and shifts local calendar day. */
const DAY_KEY_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function dateInputToDayKey(d: Date | string): string | null {
  if (typeof d === 'string') {
    const s = d.trim();
    if (DAY_KEY_ONLY.test(s)) return s;
    const parsed = new Date(s);
    if (isNaN(parsed.getTime())) return null;
    return toDayKey(parsed);
  }
  if (isNaN(d.getTime())) return null;
  return toDayKey(d);
}

const GAP = 2;
/** Full rolling year on the home journal card. */
const YEAR_DAYS = 365;
const YEAR_MIN_CELL = 8;
const GRID_WRAP_PADDING_X = 8;

export default function ActivityTracker({
  dates = [],
  color,
  icon,
  name,
  timeInterval = 'Year',
  onTitlePress,
  headerActions,
}: ActivityTrackerProps) {
  const theme = useEzuiTheme();
  const [gridInnerWidth, setGridInnerWidth] = useState(() => {
    const w = Dimensions.get('window').width;
    return Math.max(0, w - 48);
  });

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    const inner = Math.max(0, w - GRID_WRAP_PADDING_X * 2);
    setGridInnerWidth(inner);
  }, []);

  const { numColumns, cellSize, cellBorderRadius, gridCells } = useMemo(() => {
    if (timeInterval === 'Week') {
      return {
        numColumns: 7,
        cellSize: 64,
        cellBorderRadius: 16,
        gridCells: getGridDates(7),
      };
    }
    if (timeInterval === 'Month') {
      return {
        numColumns: 15,
        cellSize: 32,
        cellBorderRadius: 9,
        gridCells: getGridDates(30),
      };
    }

    const inner = gridInnerWidth;
    let cols = 14;
    let size = YEAR_MIN_CELL;
    if (inner > 0) {
      cols = Math.max(
        14,
        Math.floor((inner + GAP) / (YEAR_MIN_CELL + GAP))
      );
      cols = Math.min(YEAR_DAYS, cols);
      size = (inner - (cols - 1) * GAP) / cols;
      while (size < YEAR_MIN_CELL && cols > 14) {
        cols -= 1;
        size = (inner - (cols - 1) * GAP) / cols;
      }
    }
    const radius = Math.max(2, Math.min(8, Math.floor(size * 0.25)));
    const rows = Math.ceil(YEAR_DAYS / cols);
    const totalSlots = rows * cols;
    const main = getGridDates(YEAR_DAYS);
    const pad = totalSlots - YEAR_DAYS;
    const padded: { date: Date; key: string }[] = [];
    for (let p = 0; p < pad; p++) {
      padded.push({ date: new Date(0), key: `__pad_${p}` });
    }
    padded.push(...main);
    return {
      numColumns: cols,
      cellSize: Math.max(1, size),
      cellBorderRadius: radius,
      gridCells: padded,
    };
  }, [timeInterval, gridInnerWidth]);

  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (const d of dates) {
      const key = dateInputToDayKey(d);
      if (key) set.add(key);
    }
    return set;
  }, [dates]);

  const showActions = (headerActions?.length ?? 0) > 0;

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
        {showActions ? (
          <View style={styles.titleActionCluster}>
            {headerActions!.map((action) => (
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
          </View>
        ) : null}
      </View>
      <View
        style={[styles.gridWrap, { backgroundColor: theme.colors.surface }]}
        onLayout={onGridLayout}
      >
        <FlatList
          data={gridCells}
          numColumns={numColumns}
          scrollEnabled={false}
          keyExtractor={(item) => item.key}
          key={`grid-${numColumns}-${gridCells.length}`}
          style={styles.flatList}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ActivityCell
              color={color}
              completed={completedSet.has(item.key)}
              justCompleted={false}
              cellSize={cellSize}
              borderRadius={cellBorderRadius}
            />
          )}
        />
      </View>
    </View>
  );

  if (onTitlePress) {
    return (
      <Pressable
        onPress={onTitlePress}
        accessibilityRole="button"
        accessibilityLabel={`Open journal ${name}`}
      >
        {body}
      </Pressable>
    );
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
});
