import type { ReactNode } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { ButtonProps, ButtonVariant } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

function filledBackground(
  variant: ButtonVariant,
  theme: ReturnType<typeof useEzuiTheme>,
  color: string | undefined,
): string {
  if (color) return color;
  if (variant === 'secondary') return theme.colors.secondary;
  if (variant === 'tertiary') return theme.colors.tertiary;
  return theme.colors.primary;
}

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'outline',
  color,
  style,
  icon,
  iconStyle,
  textStyle,
  children,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useEzuiTheme();
  const isOutline = variant === 'outline';
  const accent = color ?? theme.colors.primary;

  const containerStyle = isOutline
    ? {
        backgroundColor: 'transparent' as const,
        borderWidth: 2,
        borderColor: accent,
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      }
    : {
        backgroundColor: filledBackground(variant, theme, color),
        borderWidth: 0,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      };

  const labelColor = isOutline ? accent : theme.colors.text;

  const body: ReactNode =
    children != null ? (
      children
    ) : label ? (
      <Text style={[styles.text, { color: labelColor }, textStyle]}>{label}</Text>
    ) : null;

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, containerStyle, disabled && styles.disabled, style]}
    >
      {icon != null ? <View style={iconStyle}>{icon}</View> : null}
      {body}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    padding: 16,
    borderRadius: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
