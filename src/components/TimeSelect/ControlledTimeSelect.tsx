import { Controller } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import TimeSelect from './TimeSelect';
import type { ControlledTimeSelectProps } from './types';

function parseTimeString(s: string): Date {
  const d = new Date();
  if (!s || typeof s !== 'string') return d;
  const [h, m] = s.split(':').map(Number);
  if (Number.isInteger(h) && Number.isInteger(m)) {
    d.setHours(h, m, 0, 0);
  }
  return d;
}

function formatTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export default function ControlledTimeSelect({
  control,
  name,
  error,
  style,
}: ControlledTimeSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={style}>
          <TimeSelect
            value={parseTimeString(field.value ?? '')}
            onChange={(date) => {
              field.onChange(formatTimeString(date));
              field.onBlur();
            }}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
