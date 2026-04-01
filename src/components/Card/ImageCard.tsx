import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import type { ImageCardProps } from './types';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export function ImageCard({
  imageUrl,
  source,
  tags,
  title,
  description,
  onPress,
  contentBackgroundVisible = true,
  contentBackgroundColor,
  contentBackgroundBlurIntensity = 60,
  onEdit,
  onDelete,
}: ImageCardProps) {
  const theme = useEzuiTheme();
  const imageSource = source ?? (imageUrl != null ? { uri: imageUrl } : null);
  const showBlur = contentBackgroundVisible && contentBackgroundColor == null;
  const showSolid = contentBackgroundVisible && contentBackgroundColor != null;
  return (
    <View style={[styles.card]}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <>
            <Image source={imageSource} style={styles.image} />
            <View style={styles.content}>
              {showBlur ? (
                <BlurView
                  intensity={contentBackgroundBlurIntensity}
                  tint="dark"
                  style={styles.contentBackground}
                  {...(Platform.OS === 'android' && {
                    experimentalBlurMethod: 'dimezisBlurView' as const,
                  })}
                />
              ) : null}
              {showSolid ? (
                <View
                  style={[
                    styles.contentBackground,
                    {
                      backgroundColor:
                        contentBackgroundColor ?? theme.colors.surface,
                    },
                  ]}
                />
              ) : null}
              <View style={styles.contentInner}>
                <View style={styles.contentLeft}>
                  <Text style={styles.title}>{title}</Text>
                  <Text
                    style={[styles.description, { color: theme.colors.text }]}
                  >
                    {description}
                  </Text>
                </View>
                {onPress ? <Button label="View" onPress={onPress} /> : null}
                {onEdit ? (
                  <Button
                    onPress={onEdit}
                    icon={
                      <Ionicons
                        name="pencil-outline"
                        size={24}
                        color={theme.colors.text}
                      />
                    }
                  />
                ) : null}
                {onDelete ? (
                  <Button
                    label="Delete"
                    onPress={onDelete}
                    color="red"
                    icon={
                      <Ionicons name="trash-outline" size={24} color="red" />
                    }
                  />
                ) : null}
              </View>
            </View>
          </>
        ) : null}
      </View>
      {tags != null ? (
        <View style={styles.tags}>
          <Tag
            label={tags.label}
            color={tags.color ?? theme.colors.textMuted}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  contentBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  contentInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  contentLeft: {
    flexDirection: 'column',
  },
});
