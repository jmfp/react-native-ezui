import { View, StyleSheet } from 'react-native';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Text } from 'react-native';
import { TagProps } from './types';
const theme = useEzuiTheme();

export default function Tag({ label, color }: TagProps) {
  return (
    <View>
      <Text style={styles.tag}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
  },
});
