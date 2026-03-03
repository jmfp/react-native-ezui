import { View, Text, Image, StyleSheet } from 'react-native';
import type { ImageCardProps } from './types';
import { Button } from '../Button';
import { useEzuiTheme } from '../../theme/ThemeContext';

export function ImageCard({
  imageUrl,
  source,
  tags,
  title,
  description,
  onPress,
}: ImageCardProps) {
  const theme = useEzuiTheme();
  const imageSource = source ?? (imageUrl != null ? { uri: imageUrl } : null);
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      {imageSource ? <Image source={imageSource} style={styles.image} /> : null}
      {tags != null ? (
        <View style={styles.tags}>
          <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>
            {tags.label}
          </Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <View style={styles.contentLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {description}
          </Text>
        </View>
        {onPress ? <Button label="View" onPress={onPress} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  contentLeft: {
    flexDirection: 'column',
  },
});
