import type { Control } from 'react-hook-form';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type CalendarProps = {
  datesWithEvents?: Date[];
  selectedDateId?: string;
  initialMonthId?: string;
  onDayPress?: (dateId: string) => void;
  onChange?: (date: Date) => void;
  date?: Date;
  width?: number | string;
};

export type MinimalCalendarProps = {
  datesWithEvents?: Date[];
  month?: string;
  dotsVerticalSpacing?: number;
  onPress?: () => void;
  summaryCaption?: string;
};

export type DatePickerProps = {
  date: Date;
  onChange: (date: Date) => void;
};

export type ControlledDatePickerProps = {
  control: Control<any>;
  name: string;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};
