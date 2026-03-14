import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  Calendar as FlashCalendar,
  fromDateId,
  toDateId,
} from '@marceloterreiro/flash-calendar';
import { useEzuiTheme } from '../../theme/ThemeContext';
import type { CalendarProps } from './types';

export default function Calendar({
  datesWithEvents = [],
  selectedDateId: controlledSelectedDateId,
  initialMonthId,
  date: dateProp,
  onDayPress,
  onChange,
  width,
}: CalendarProps) {
  const theme = useEzuiTheme();
  const todayId = useMemo(() => toDateId(new Date()), []);
  const [internalSelected, setInternalSelected] = useState(todayId);

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

  const dateIdStable = useMemo(() => {
    if (dateProp == null) return null;
    const d = typeof dateProp === 'string' ? new Date(dateProp) : dateProp;
    return Number.isNaN(d.getTime()) ? null : toDateId(d);
  }, [
    dateProp == null
      ? null
      : typeof dateProp === 'string'
        ? dateProp
        : (dateProp as Date).getTime(),
  ]);

  const controlledIdFromDate = dateIdStable ?? undefined;

  const selectedDateId =
    controlledSelectedDateId ?? controlledIdFromDate ?? internalSelected;

  const handleDayPress = useCallback(
    (dateId: string) => {
      if (
        controlledSelectedDateId === undefined &&
        controlledIdFromDate === undefined
      ) {
        setInternalSelected(dateId);
      }
      onDayPress?.(dateId);
      onChange?.(fromDateId(dateId));
    },
    [controlledSelectedDateId, controlledIdFromDate, onDayPress, onChange]
  );

  const activeRanges = useMemo(
    () => [{ startId: selectedDateId, endId: selectedDateId }],
    [selectedDateId]
  );

  const monthId = useMemo(() => {
    const id = initialMonthId ?? selectedDateId ?? todayId;
    const parsed = new Date(id + (id.length === 7 ? '-01' : ''));
    return Number.isNaN(parsed.getTime()) ? todayId : id.length === 7 ? `${id}-01` : id;
  }, [initialMonthId, selectedDateId, todayId]);

  const themeWithWidth = useMemo(
    () => ({
      rowMonth: {
        content: { color: theme.colors.text },
        ...(width !== undefined && { container: { width } }),
      },
      itemWeekName: {
        content: { color: theme.colors.textMuted },
      },
      rowWeek: {
        ...(width !== undefined && { container: { width } }),
      },
      itemDay: {
        base: (params: { id: string }) => ({
          content: {
            color: eventDateIds.has(params.id)
              ? theme.colors.primary
              : theme.colors.text,
          },
        }),
        active: () => ({
          container: { backgroundColor: theme.colors.surface },
        }),
        today: () => ({
          content: {
            color: theme.colors.primary,
            fontWeight: '600' as const,
          },
        }),
      },
    }),
    [
      theme.colors.text,
      theme.colors.textMuted,
      theme.colors.primary,
      width,
      eventDateIds,
    ]
  );

  const content = (
    <FlashCalendar
      calendarMonthId={monthId}
      calendarActiveDateRanges={activeRanges}
      onCalendarDayPress={handleDayPress}
      calendarColorScheme="light"
      calendarFormatLocale="en-US"
      calendarRowHorizontalSpacing={2}
      calendarRowVerticalSpacing={2}
      theme={themeWithWidth}
    />
  );

  if (width !== undefined) {
    return <View style={{ width, overflow: 'hidden' }}>{content}</View>;
  }

  return content;
}
