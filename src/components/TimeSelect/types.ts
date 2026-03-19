export type TimeSelectProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export type ControlledTimeSelectProps = {
  control: import('react-hook-form').Control<any>;
  name: string;
  error?: string;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
};
