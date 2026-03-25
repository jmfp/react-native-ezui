import { Text, StyleSheet, Pressable, View, FlatList } from 'react-native';
import type { PriceCardProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Image, type ImageSource } from 'expo-image';
import SpringHabtHeader from '../../../../../../assets/images/SpringHabtHeader.png';
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
        source={SpringHabtHeader as ImageSource}
        style={styles.image}
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
          <FlatList
            data={features ?? []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            contentContainerStyle={styles.features}
            renderItem={({ item }) => (
              <View style={[styles.feature, { borderColor: item.color }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text
                  style={[styles.featureText, { color: theme.colors.text }]}
                >
                  {item.title}
                </Text>
              </View>
            )}
          />
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
    height: 200,
    resizeMode: 'contain',
  },
  features: {
    gap: 16,
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
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
