import { View, StyleSheet, Text } from 'react-native';
import { useEzuiTheme } from '../../theme/ThemeContext';
import type { TagProps } from './types';

export default function Tag({ label, color }: TagProps) {
  const theme = useEzuiTheme();
  return (
    <View>
      <Text
        style={[
          styles.tag,
          {
            color: theme.colors.text,
            backgroundColor: color ?? theme.colors.primary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  tag: {
    padding: 10,
    borderRadius: 10,
  },
});
