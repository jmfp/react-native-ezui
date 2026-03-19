import { Controller } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import type { ControlledImageUploadProps } from './types';
import ImageUpload from './ImageUpload';

export default function ControlledImageUpload({
  control,
  name,
  error,
  errorStyle,
  style,
}: ControlledImageUploadProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={style}>
          <ImageUpload
            value={field.value?.uri ?? null}
            onImageUpload={(_uri, picked) => picked && field.onChange(picked)}
            onImageRemove={() => field.onChange(null)}
            onImageError={() => {}}
          />
          {error ? (
            <Text style={errorStyle ?? styles.errorText}>{error}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
