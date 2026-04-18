import { Text, StyleSheet, Pressable, View, AccessibilityInfo } from 'react-native';
import type { PriceCardProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';
import { Image, type ImageSource } from 'expo-image';
import SpringHabitShortHeader from '../../../../../../assets/images/SpringHabitShortHeader.png';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../Button';

const BOB_PX = 5;
const BOB_HALF_MS = 850;

export default function PriceCard({
  amount,
  interval,
  onPress,
  style,
  features,
  ctaText,
  defaultExpanded = false,
  onboardingTrialHighlight = false,
}: PriceCardProps) {
  const theme = useEzuiTheme();
  const [showMore, setShowMore] = useState(defaultExpanded);
  const [reduceMotion, setReduceMotion] = useState(false);
  const bobY = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (!cancelled) setReduceMotion(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!showMore) {
      cancelAnimation(bobY);
      bobY.value = 0;
      return;
    }
    if (reduceMotion) {
      cancelAnimation(bobY);
      bobY.value = 0;
      return;
    }
    bobY.value = withRepeat(
      withSequence(
        withTiming(-BOB_PX, {
          duration: BOB_HALF_MS,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: BOB_HALF_MS,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(bobY);
      bobY.value = 0;
    };
  }, [showMore, reduceMotion, bobY]);

  const ctaBobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }],
  }));

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
      {onboardingTrialHighlight ? (
        <View style={styles.priceBlock}>
          <Text
            style={[
              styles.text,
              styles.struckPrice,
              { color: theme.colors.textMuted },
            ]}
          >{`$${amount} / ${interval}`}</Text>
          <Text
            style={[styles.trialLine, { color: theme.colors.primary }]}
          >
            Free for 7 days
          </Text>
        </View>
      ) : (
        <Text
          style={[styles.text, { color: theme.colors.text }]}
        >{`$${amount} / ${interval}`}</Text>
      )}
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
          <Animated.View style={[styles.ctaWrap, ctaBobStyle]}>
            <Button label={ctaText ?? 'Subscribe'} onPress={onPress} />
          </Animated.View>
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
  priceBlock: {
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  struckPrice: {
    textDecorationLine: 'line-through',
  },
  trialLine: {
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
  ctaWrap: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
