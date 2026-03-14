import { Image, View, StyleSheet, Text } from 'react-native';
import type { AvatarProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Avatar({
  imageUrl,
  fallbackInitial,
  rounded,
  style,
}: AvatarProps) {
  const theme = useEzuiTheme();
  return (
    <View style={style}>
      {imageUrl ? (
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      ) : fallbackInitial ? (
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.initial, { color: theme.colors.text }]}>
            {fallbackInitial}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
