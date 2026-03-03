import { TextInput, StyleSheet } from 'react-native';
import type { InputProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export function Input({
  placeholder,
  value,
  onChangeText,
  style,
  textStyle,
  icon,
  iconStyle,
  error,
  errorStyle,
}: InputProps) {
  const theme = useEzuiTheme();
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        { borderColor: theme.colors.border, color: theme.colors.text },
        style,
      ]}
      selectionColor={theme.colors.primary}
      placeholderTextColor={theme.colors.textMuted}
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
