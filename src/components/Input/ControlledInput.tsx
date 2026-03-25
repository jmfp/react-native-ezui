import { Controller } from 'react-hook-form';
import type { ControlledInputProps } from './types';
import { Input } from './Input';

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
        <Input
          placeholder={placeholder}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          style={style}
          textStyle={textStyle}
          error={error}
          errorStyle={errorStyle}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
