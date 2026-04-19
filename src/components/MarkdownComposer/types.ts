import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type MarkdownComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxLength?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  livePreview?: boolean;
  renderMarkdownPreview?: (markdown: string) => ReactNode;
  livePreviewDebounceMs?: number;
  livePreviewMaxHeight?: number;
};
