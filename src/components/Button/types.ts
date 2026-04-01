import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'outline' | 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = {
  label?: string;
  children?: ReactNode;
  onPress?: (value?: any) => void | Promise<void>;
  disabled?: boolean;
  variant?: ButtonVariant;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  style?: ViewStyle;
  iconStyle?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
};
