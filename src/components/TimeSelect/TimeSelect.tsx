import { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import type { TimeSelectProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Input } from '../Input';

function formatTimeWithAmPm(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const h12 = h % 12 || 12;
  const amPm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${String(m).padStart(2, '0')} ${amPm}`;
}

export default function TimeSelect({ value, onChange }: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useEzuiTheme();

  const adjustTime = (deltaHours: number, deltaMinutes: number) => {
    const d = new Date(value);
    const h = d.getHours();
    const m = d.getMinutes();
    const nextMinutes = (m + deltaMinutes + 60) % 60;
    const carryHour = m + deltaMinutes >= 60 ? 1 : m + deltaMinutes < 0 ? -1 : 0;
    const nextHours = (h + deltaHours + carryHour + 24) % 24;
    d.setHours(nextHours, nextMinutes, 0, 0);
    onChange(d);
  };

  const toggleAmPm = () => {
    const d = new Date(value);
    const h = d.getHours();
    d.setHours((h + 12) % 24);
    onChange(d);
  };

  const hours12 = (() => {
    const h = value.getHours();
    return h % 12 || 12;
  })();

  const minutes = value.getMinutes();
  const am = value.getHours() < 12;

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setIsOpen((open) => !open)}>
        <View pointerEvents="none">
          <Input
            placeholder="Select time"
            value={formatTimeWithAmPm(value)}
            onChangeText={() => {}}
            editable={false}
          />
        </View>
      </Pressable>
      {isOpen && (
        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.column}>
              <Pressable
                onPress={() => adjustTime(1, 0)}
                style={styles.adjustButton}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>
                  ▲
                </Text>
              </Pressable>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>
                {hours12}
              </Text>
              <Pressable
                onPress={() => adjustTime(-1, 0)}
                style={styles.adjustButton}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>
                  ▼
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.separator, { color: theme.colors.text }]}>
              :
            </Text>
            <View style={styles.column}>
              <Pressable
                onPress={() => adjustTime(0, 5)}
                style={styles.adjustButton}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>
                  ▲
                </Text>
              </Pressable>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>
                {String(minutes).padStart(2, '0')}
              </Text>
              <Pressable
                onPress={() => adjustTime(0, -5)}
                style={styles.adjustButton}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>
                  ▼
                </Text>
              </Pressable>
            </View>
            <View style={styles.column}>
              <Pressable
                onPress={toggleAmPm}
                style={styles.amPmButton}
              >
                <Text style={[styles.valueText, { color: theme.colors.text }]}>
                  {am ? 'AM' : 'PM'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  adjustButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adjustText: {
    fontSize: 12,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    fontSize: 18,
    fontWeight: '600',
  },
  amPmButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
});
