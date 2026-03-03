import { View, StyleSheet } from 'react-native';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Text } from 'react-native';
const theme = useEzuiTheme();

export default function Tag() {
  return (
    <View>
      <Text style={styles.tag}>Tag</Text>
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
