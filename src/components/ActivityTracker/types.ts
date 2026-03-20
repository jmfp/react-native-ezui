export type ActivityTrackerProps = {
  name: string;
  description: string;
  dates: Array<Date | string>;
  onAddCompletion: (date: Date) => void;
  color: string;
  icon: string;
  timeInterval?: 'Week' | 'Month' | 'Year';
  onTitlePress?: () => void;
};

export type ActivityCellProps = {
  color: string;
  completed: boolean;
  justCompleted: boolean;
  cellSize: number;
  borderRadius: number;
};
