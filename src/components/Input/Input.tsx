import { TextInput, StyleSheet } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import type { InputProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

const typeToKeyboardType: Partial<
  Record<NonNullable<InputProps['type']>, KeyboardTypeOptions>
> = {
  text: 'default',
  email: 'email-address',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
  search: 'web-search',
};

export function Input({
  placeholder,
  value,
  onChangeText,
  onBlur,
  style,
  selectionColor,
  secureTextEntry = false,
  type,
  maxLength,
  editable = true,
}: InputProps) {
  const theme = useEzuiTheme();
  const keyboardType = type
    ? (typeToKeyboardType[type] ?? 'default')
    : undefined;
  return (
    <TextInput
      editable={editable}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      style={[
        styles.input,
        { borderColor: theme.colors.border, color: theme.colors.text },
        style,
      ]}
      selectionColor={selectionColor ?? theme.colors.primary}
      placeholderTextColor={theme.colors.textMuted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
});
