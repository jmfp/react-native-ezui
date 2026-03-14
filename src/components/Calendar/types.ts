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
};

export type DatePickerProps = {
  date: Date;
  onChange: (date: Date) => void;
};
