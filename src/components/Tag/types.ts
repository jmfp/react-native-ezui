import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export type TagProps = {
  label: string;
  color?: string;
  backgroundColor?: string;
  icon?: IoniconsName;
};
