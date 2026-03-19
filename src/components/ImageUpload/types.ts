import type { Control } from 'react-hook-form';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type PickedImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

export type ImageUploadProps = {
  value?: string | null;
  onImageUpload?: (imageUri: string, asset?: PickedImage) => void;
  onImageRemove?: (image: string) => void;
  onImageError?: (error: Error) => void;
  onImageLoad?: (image: string) => void;
  onImageProgress?: (progress: number) => void;
  onImageLoadError?: (error: Error) => void;
  onImageLoadProgress?: (progress: number) => void;
  onImageLoadEnd?: () => void;
  onImageLoadStart?: () => void;
};

export type ControlledImageUploadProps = {
  control: Control<any>;
  name: string;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};
