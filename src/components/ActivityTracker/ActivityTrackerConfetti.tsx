import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const PALETTE = [
  '#fde047',
  '#facc15',
  '#eab308',
  '#fcd34d',
  '#fef3c7',
  '#ffffff',
  '#f59e0b',
];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type PieceConfig = {
  left: number;
  top0: number;
  drift: number;
  fall: number;
  rotateTo: number;
  w: number;
  h: number;
  color: string;
  delay: number;
  duration: number;
};

function buildPieces(
  width: number,
  height: number,
  burstId: number,
  accent: string
): PieceConfig[] {
  const rand = mulberry32(((burstId * 7919) ^ (width << 2) ^ (height << 1)) >>> 0);
  const count = 28;
  const pieces: PieceConfig[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      left: rand() * Math.max(8, width - 10),
      top0: -30 - rand() * 70,
      drift: (rand() - 0.5) * (width * 0.45),
      fall: height + 80 + rand() * 120,
      rotateTo: (rand() - 0.5) * 10,
      w: 6 + rand() * 7,
      h: 8 + rand() * 10,
      color:
        rand() < 0.32
          ? accent
          : PALETTE[Math.floor(rand() * PALETTE.length)] ?? '#facc15',
      delay: rand() * 220,
      duration: 1600 + rand() * 1200,
    });
  }
  return pieces;
}

const ConfettiPiece = memo(function ConfettiPiece({ cfg }: { cfg: PieceConfig }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = 0;
    p.value = withTiming(1, {
      duration: cfg.duration,
      delay: cfg.delay,
      easing: Easing.out(Easing.cubic),
    });
  }, [cfg, p]);

  const style = useAnimatedStyle(() => ({
    opacity:
      p.value < 0.08
        ? p.value / 0.08
        : p.value > 0.88
          ? (1 - p.value) / 0.12
          : 1,
    transform: [
      { translateX: cfg.drift * p.value },
      { translateY: cfg.top0 + cfg.fall * p.value },
      { rotate: `${cfg.rotateTo * p.value * 360}deg` },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          left: cfg.left,
          top: 0,
          width: cfg.w,
          height: cfg.h,
          backgroundColor: cfg.color,
        },
        style,
      ]}
    />
  );
});

type Props = {
  width: number;
  height: number;
  burstId: number;
  accentColor: string;
};

export default function ActivityTrackerConfetti({
  width,
  height,
  burstId,
  accentColor,
}: Props) {
  const pieces = useMemo(
    () => buildPieces(width, height, burstId, accentColor),
    [width, height, burstId, accentColor]
  );

  if (width < 8 || height < 8 || burstId < 1) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.layer, { width, height }]}
    >
      {pieces.map((cfg, i) => (
        <ConfettiPiece key={`${burstId}-${i}`} cfg={cfg} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 20,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    borderRadius: 2,
  },
});
