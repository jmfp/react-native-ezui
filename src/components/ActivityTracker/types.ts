import type { IoniconsName } from 'react-native-ezui';

export type ActivityTrackerProps = {
  name: string;
  description: string;
  dates: Array<Date | string>;
  onAddCompletion: (date: Date) => void;
  color: string;
  icon: IoniconsName;
  timeInterval?: 'Week' | 'Month' | 'Year';
};
