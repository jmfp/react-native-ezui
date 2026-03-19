import { Controller } from 'react-hook-form';
import type { ControlledInputProps } from './types';
import { Input } from './Input';
import { Text, StyleSheet, View } from 'react-native';

export default function ControlledInput({
  control,
  name,
  placeholder = '',
  style,
  textStyle,
  error,
  errorStyle,
}: ControlledInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Input
            placeholder={placeholder}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            style={[style, error ? styles.errorBorder : null]}
            textStyle={textStyle}
            error={error}
            onBlur={field.onBlur}
          />
          <View style={styles.errorContainer}>
            {error ? (
              <Text style={errorStyle || styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    height: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },

  errorBorder: {
    borderColor: 'red',
  },
});
