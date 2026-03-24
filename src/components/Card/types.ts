import type { ImageSourcePropType } from 'react-native';

export type ImageCardProps = {
  /** Remote image: use imageUrl with an https:// URL. Local image: use source={require('./path.jpg')} and omit imageUrl. */
  imageUrl?: string;
  source?: ImageSourcePropType;
  tags?: {
    label: string;
    color: string;
  };
  title: string;
  description: string;
  onPress?: () => void;
  contentBackgroundVisible?: boolean;
  contentBackgroundColor?: string;
  contentBackgroundBlurIntensity?: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type ColorCardProps = {
  color?: string;
  title?: string;
  children: React.ReactNode;
};

export type QuizCardProps = {
  questions: string[];
  answers: string[];
  currentQuestion: number;
  onPress?: () => void;
};
