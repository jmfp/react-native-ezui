import type { StyleProp, ViewStyle } from 'react-native';

export type AvatarProps = {
  imageUrl?: string;
  fallbackInitial?: string;
  rounded?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};
