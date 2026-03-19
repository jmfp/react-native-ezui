import { Controller } from 'react-hook-form';
import { Text, View, StyleSheet } from 'react-native';
import type { ControlledDatePickerProps } from './types';
import DatePicker from './DatePicker';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  return new Date();
}

export default function ControlledDatePicker({
  control,
  name,
  error,
  errorStyle,
  style,
}: ControlledDatePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={style}>
          <DatePicker
            date={toDate(field.value)}
            onChange={(date) => {
              field.onChange(date);
              field.onBlur();
            }}
          />
          <View style={styles.errorContainer}>
            {error ? (
              <Text style={errorStyle ?? styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    height: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
