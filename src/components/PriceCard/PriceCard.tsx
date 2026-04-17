import { Text, StyleSheet, Pressable, View } from 'react-native';
import type { PriceCardProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Image, type ImageSource } from 'expo-image';
import SpringHabitShortHeader from '../../../../../../assets/images/SpringHabitShortHeader.png';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../Button';
export default function PriceCard({
  amount,
  interval,
  onPress,
  style,
  features,
  ctaText,
  defaultExpanded = false,
}: PriceCardProps) {
  const theme = useEzuiTheme();
  const [showMore, setShowMore] = useState(defaultExpanded);
  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.surface }, style]}
    >
      <Image
        source={SpringHabitShortHeader as ImageSource}
        style={styles.image}
        contentFit="contain"
        accessibilityLabel="SpringHabt"
      />
      <Text
        style={[styles.text, { color: theme.colors.text }]}
      >{`$${amount} / ${interval}`}</Text>
      <Pressable onPress={() => setShowMore(!showMore)}>
        <Text style={[styles.learnMore, { color: theme.colors.primary }]}>
          {showMore ? 'Show less' : 'Learn More'}
        </Text>
      </Pressable>
      {showMore && (
        <>
          <View style={styles.features}>
            {(features ?? []).map((item, index) => (
              <View
                key={`${item.title}-${index}`}
                style={[styles.feature, { borderColor: item.color }]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text
                  style={[styles.featureText, { color: theme.colors.text }]}
                >
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
          <Button label={ctaText ?? 'Subscribe'} onPress={onPress} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  learnMore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 160,
  },
  features: {
    gap: 16,
    width: '100%',
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  feature: {
    width: '100%',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
  },
  featureText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
