import { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import type { DatePickerProps } from './types';
import Calendar from './Calendar';
import { Ionicons } from '@expo/vector-icons';
import { useEzuiTheme } from '../../theme/ThemeContext';

function toMonthId(d: Date | string): string {
  const x = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(x.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function toCalendarMonthId(monthId: string): string {
  return `${monthId}-01`;
}

function prevMonthId(monthId: string): string {
  const d = new Date(monthId + '-01T00:00:00');
  if (Number.isNaN(d.getTime())) return toMonthId(new Date());
  d.setMonth(d.getMonth() - 1);
  return toMonthId(d);
}

function nextMonthId(monthId: string): string {
  const d = new Date(monthId + '-01T00:00:00');
  if (Number.isNaN(d.getTime())) return toMonthId(new Date());
  d.setMonth(d.getMonth() + 1);
  return toMonthId(d);
}

export default function DatePicker({ date, onChange }: DatePickerProps) {
  const [slotWidth, setSlotWidth] = useState<number | undefined>();
  const [displayMonthId, setDisplayMonthId] = useState(() =>
    toMonthId(date)
  );
  const theme = useEzuiTheme();

  const onSlotLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      setSlotWidth(e.nativeEvent.layout.width);
    },
    []
  );

  const goPrev = useCallback(() => {
    setDisplayMonthId((id) => prevMonthId(id));
  }, []);
  const goNext = useCallback(() => {
    setDisplayMonthId((id) => nextMonthId(id));
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={goPrev} style={styles.icon} hitSlop={8}>
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={theme.colors.text}
        />
      </Pressable>
      <View style={styles.calendarSlot} onLayout={onSlotLayout}>
        {slotWidth !== undefined && (
          <Calendar
            date={date}
            onChange={onChange}
            width={slotWidth}
            initialMonthId={toCalendarMonthId(displayMonthId)}
          />
        )}
      </View>
      <Pressable onPress={goNext} style={styles.icon} hitSlop={8}>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={theme.colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    padding: 16,
    flexShrink: 0,
  },
  calendarSlot: {
    flex: 1,
    minWidth: 0,
  },
});
