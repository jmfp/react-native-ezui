import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { ButtonProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export function Button({
  label,
  onPress,
  disabled = false,
  style,
  icon,
  iconStyle,
  textStyle,
}: ButtonProps) {
  const theme = useEzuiTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.shadow,
        },
        style,
      ]}
    >
      {icon != null ? <View style={iconStyle}>{icon}</View> : null}
      <Text style={[styles.text, { color: theme.colors.text }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
    borderRadius: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
