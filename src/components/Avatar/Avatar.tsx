import { Image, View, StyleSheet, Text } from 'react-native';
import type { AvatarProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Avatar({
  imageUrl,
  fallbackInitial,
  rounded,
  size = 100,
  style,
}: AvatarProps) {
  const theme = useEzuiTheme();
  const r = size / 2;
  const initialFont = Math.max(12, Math.round(size * 0.42));
  const box = [
    styles.avatarContainer,
    {
      width: size,
      height: size,
      borderRadius: rounded === false ? 8 : r,
    },
    {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
  ];
  return (
    <View style={style}>
      {imageUrl ? (
        <View style={box}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size, height: size, borderRadius: rounded === false ? 8 : r }}
          />
        </View>
      ) : fallbackInitial ? (
        <View style={box}>
          <Text
            style={[
              styles.initial,
              { color: theme.colors.text, fontSize: initialFont },
            ]}
          >
            {fallbackInitial}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initial: {
    fontWeight: 'bold',
  },
});
