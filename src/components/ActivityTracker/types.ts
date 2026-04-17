import type { ReactNode } from 'react';

export type ActivityTrackerHeaderAction = {
  key: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'outline' | 'primary';
};

export type ActivityTrackerCompletionNavigator = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export type ActivityTrackerProps = {
  name: string;
  description: string;
  dates: Array<Date | string>;
  onAddCompletion: (date: Date) => void;
  color: string;
  icon: string;
  timeInterval?: 'Week' | 'Month' | 'Year';
  onTitlePress?: () => void;
  headerActions?: ActivityTrackerHeaderAction[];
  completionNavigator?: ActivityTrackerCompletionNavigator;
};

export type ActivityCellProps = {
  color: string;
  completed: boolean;
  justCompleted: boolean;
  cellSize: number;
  borderRadius: number;
};
