import { View, StyleSheet, Text } from 'react-native';
import { useEzuiTheme } from '../../theme/ThemeContext';
import type { TagProps } from './types';
import { Ionicons } from '@expo/vector-icons';

export default function Tag({
  label,
  color,
  backgroundColor,
  icon,
  borderRadius,
  iconColor,
  textColor,
}: TagProps) {
  const theme = useEzuiTheme();
  return (
    <View
      style={[
        styles.tagContainer,
        {
          borderColor: color ?? theme.colors.primary,
          backgroundColor: backgroundColor ?? 'transparent',
          borderRadius: borderRadius ?? theme.constants.borderRadius ?? 10,
        },
      ]}
    >
      <View
        style={[
          styles.tagContent,
          {
            justifyContent: icon ? 'space-between' : 'flex-end',
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={iconColor ?? theme.colors.text}
          />
        )}
        <Text
          style={[
            styles.tag,
            {
              color: textColor ?? theme.colors.text,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  tag: {
    padding: 8,
    fontSize: 12,
    alignSelf: 'center',
  },
  tagContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
});
