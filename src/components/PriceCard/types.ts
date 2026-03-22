import type { StyleProp, ViewStyle } from 'react-native';
import type { IoniconsName } from '../Tag';

export type PriceCardProps = {
  amount: number;
  interval: string;
  description: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  ctaText?: string;
  features?: PriceCardFeature[];
};

export type PriceCardFeature = {
  title: string;
  icon: IoniconsName;
  color: string;
};
