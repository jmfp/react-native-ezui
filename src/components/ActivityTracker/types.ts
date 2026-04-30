import type { ReactNode } from 'react';

export type ActivityTrackerHeaderAction = {
  key: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'outline' | 'primary';
};

export type ActivityTrackerProps = {
  name: string;
  description: string;
  dates: Array<Date | string>;
  color: string;
  icon: string;
  timeInterval?: 'Week' | 'Month' | 'Year';
  onTitlePress?: () => void;
  headerActions?: ActivityTrackerHeaderAction[];
};

export type ActivityCellProps = {
  color: string;
  completed: boolean;
  justCompleted: boolean;
  cellSize: number;
  borderRadius: number;
};
