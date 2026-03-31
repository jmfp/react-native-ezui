import type { StyleProp, ViewStyle } from 'react-native';

export type ScreenContainerProps = {
  children: React.ReactNode;
  paddingHorizontal?: number;
  paddingVertical?: number;
  gap?: number;
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollable?: boolean;
};
