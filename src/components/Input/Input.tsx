import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
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
  textStyle,
  error,
  errorStyle,
  selectionColor,
  secureTextEntry = false,
  type,
  maxLength,
  editable = true,
  border = false,
  autoCapitalize,
  autoCorrect,
  keyboardType: keyboardTypeProp,
  textContentType,
}: InputProps) {
  const theme = useEzuiTheme();
  const keyboardTypeFromType = type
    ? (typeToKeyboardType[type] ?? 'default')
    : undefined;
  const keyboardType = keyboardTypeProp ?? keyboardTypeFromType;
  const borderColor = error
    ? '#ef4444'
    : !border
      ? 'transparent'
      : theme.colors.border;
  return (
    <View style={styles.wrap}>
      <TextInput
        editable={editable}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor,
            color: theme.colors.text,
          },
          style,
          textStyle,
        ]}
        selectionColor={selectionColor ?? theme.colors.primary}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        textContentType={textContentType ?? 'none'}
        autoComplete="off"
        importantForAutofill={Platform.OS === 'android' ? 'no' : undefined}
      />
      {error ? (
        <Text style={[styles.fieldError, errorStyle]} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 4,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
  fieldError: {
    fontSize: 12,
    marginLeft: 4,
    color: '#ef4444',
  },
});
