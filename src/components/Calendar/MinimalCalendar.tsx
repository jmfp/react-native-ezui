import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEzuiTheme } from '../../theme/ThemeContext';
import type { MinimalCalendarProps } from './types';
import {
  Calendar as FlashCalendar,
  toDateId,
} from '@marceloterreiro/flash-calendar';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

const DOT_SIZE = 8;
const GAP = 10;
const COLS = 7;
const GRID_WIDTH = COLS * DOT_SIZE + (COLS - 1) * GAP;
const DEFAULT_DOTS_VERTICAL_SPACING = 24;

function toCalendarMonthId(month: string): string {
  if (!month) return toDateId(new Date());
  const parts = month.split('-');
  if (parts.length === 2) return `${month}-01`;
  return month;
}

export default function MinimalCalendar({
  datesWithEvents = [],
  month = '',
  dotsVerticalSpacing = DEFAULT_DOTS_VERTICAL_SPACING,
  onPress,
  summaryCaption,
}: MinimalCalendarProps) {
  const theme = useEzuiTheme();
  const todayId = useMemo(() => toDateId(new Date()), []);
  const activeRanges = useMemo(
    () => [{ startId: todayId, endId: todayId }],
    [todayId]
  );
  const calendarMonthId = useMemo(() => toCalendarMonthId(month), [month]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        new Date(calendarMonthId + 'T00:00:00')
      ),
    [calendarMonthId]
  );
  const yearLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
        new Date(calendarMonthId + 'T00:00:00')
      ),
    [calendarMonthId]
  );
  const eventDateIds = useMemo(
    () =>
      new Set(
        datesWithEvents
          .map((d) => {
            const x = d instanceof Date ? d : new Date(d);
            return Number.isNaN(x.getTime()) ? '' : toDateId(x);
          })
          .filter(Boolean)
      ),
    [datesWithEvents]
  );
  const calTheme = useMemo(
    () => ({
      rowMonth: {
        content: { fontSize: 0, opacity: 0 },
      },
      itemWeekName: {
        content: { fontSize: 0, opacity: 0 },
      },
      rowWeek: {
        container: { width: GRID_WIDTH, gap: GAP },
      },
      itemDayContainer: {
        spacer: {
          width: DOT_SIZE,
          minWidth: DOT_SIZE,
          flex: 0,
          marginLeft: 0,
          alignItems: 'center' as const,
        },
      },
      itemEmpty: {
        container: {
          width: DOT_SIZE,
          minWidth: DOT_SIZE,
          flex: 0,
          padding: 0,
        },
      },
      itemDay: {
        base: () => ({
          content: { fontSize: 0, opacity: 0 },
          container: {
            width: DOT_SIZE,
            height: DOT_SIZE,
            minWidth: DOT_SIZE,
            minHeight: DOT_SIZE,
            padding: 0,
            flex: 0,
            borderRadius: DOT_SIZE / 2,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
          },
        }),
        idle: (params: { id: string }) => ({
          container: {
            backgroundColor: eventDateIds.has(params.id)
              ? theme.colors.text
              : theme.colors.textMuted || theme.colors.text,
            opacity: eventDateIds.has(params.id) ? 1 : 0.6,
          },
          content: {},
        }),
        today: (params: { id: string }) => ({
          container: {
            backgroundColor: eventDateIds.has(params.id)
              ? theme.colors.text
              : theme.colors.primary,
            opacity: 1,
          },
          content: {},
        }),
        active: (params: { id: string }) => ({
          container: {
            backgroundColor: eventDateIds.has(params.id)
              ? theme.colors.text
              : theme.colors.primary,
            opacity: 1,
          },
          content: {},
        }),
        disabled: (params: { id: string }) => ({
          container: {
            backgroundColor: eventDateIds.has(params.id)
              ? theme.colors.text
              : theme.colors.textMuted || theme.colors.text,
            opacity: eventDateIds.has(params.id) ? 0.6 : 0.25,
          },
          content: {},
        }),
      },
    }),
    [theme, eventDateIds]
  );
  return (
    <Pressable
      style={[
        styles.container,
        {
          borderRadius: theme.constants.borderRadius,
          backgroundColor: theme.colors.surface,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.infoContainer}>
        <View style={styles.monthInfoContainer}>
          <View style={styles.monthTotalEvents}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text
              style={[
                styles.monthTotalEventsText,
                { color: theme.colors.text },
              ]}
            >
              {summaryCaption ??
                `${datesWithEvents.length} Total Events`}
            </Text>
          </View>
          <View style={styles.monthName}>
            <Text style={[styles.monthNameText, { color: theme.colors.text }]}>
              {monthLabel}
            </Text>
          </View>
          <Text
            style={[styles.monthTotalEventsText, { color: theme.colors.text }]}
          >{`${yearLabel}`}</Text>
        </View>
        <View
          style={[
            styles.calendarWrap,
            {
              paddingBottom: dotsVerticalSpacing,
            },
          ]}
        >
          <View style={{ width: GRID_WIDTH }}>
            <FlashCalendar
              calendarMonthId={calendarMonthId}
              calendarActiveDateRanges={activeRanges}
              onCalendarDayPress={() => {}}
              calendarColorScheme="light"
              calendarFormatLocale="en-US"
              calendarMonthHeaderHeight={0}
              calendarWeekHeaderHeight={0}
              calendarDayHeight={DOT_SIZE}
              calendarRowHorizontalSpacing={GAP}
              calendarRowVerticalSpacing={GAP}
              theme={calTheme}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
  },
  monthInfoContainer: {
    flex: 1,
    paddingVertical: 32,
    flexDirection: 'column',
  },
  monthName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  monthNameText: {
    fontSize: 32,
  },
  calendarWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTotalEvents: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthTotalEventsText: {
    fontSize: 16,
  },
});
