import { View, Text, StyleSheet } from 'react-native';
import type { ColorCardProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export function ColorCard({ color, title, children }: ColorCardProps) {
  const theme = useEzuiTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View
        style={[
          styles.color,
          { backgroundColor: color ?? theme.colors.primary },
        ]}
      >
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      <View
        style={[styles.content, { borderColor: color ?? theme.colors.border }]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    padding: 8,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    borderWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
