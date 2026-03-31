import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { PieChart as GiftedPieChart } from "react-native-gifted-charts";
import type { PieChartPropsType, pieDataItem } from "gifted-charts-core";
import Reanimated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export type { PieChartPropsType, pieDataItem } from "gifted-charts-core";

export type PieChartWrapperProps = PieChartPropsType & {
  containerStyle?: StyleProp<ViewStyle>;
  completedColor?: string;
  incompleteColor?: string;
  singleSliceRole?: "completed" | "incomplete";
  entranceDurationMs?: number;
  entranceDelayMs?: number;
  completedSliceDelayMs?: number;
  enableCompletedSliceEmphasis?: boolean;
};

const ENTRANCE_SCALE_FROM = 0.96;

function mergeHabitColors(
  data: pieDataItem[],
  completedColor?: string,
  incompleteColor?: string,
  singleSliceRole?: "completed" | "incomplete",
): pieDataItem[] {
  if (!completedColor && !incompleteColor) return data;
  if (data.length >= 2) {
    return data.map((item, i) => {
      const base: pieDataItem = { ...item, value: item.value };
      return {
        ...base,
        color:
          i === 0
            ? (completedColor ?? base.color)
            : (incompleteColor ?? base.color),
      };
    });
  }
  if (data.length === 1) {
    const only = data[0];
    if (!only) return data;
    if (completedColor && incompleteColor) {
      const role = singleSliceRole ?? "incomplete";
      return [
        {
          ...only,
          value: only.value,
          color: role === "completed" ? completedColor : incompleteColor,
        },
      ];
    }
    return [
      {
        ...only,
        value: only.value,
        color: completedColor ?? incompleteColor ?? only.color,
      },
    ];
  }
  return data;
}

function shouldEmphasizeCompletedSlice(
  data: pieDataItem[],
  completedColor?: string,
): boolean {
  if (!completedColor) return false;
  if (data.length === 2) return true;
  if (data.length === 1) {
    const first = data[0];
    return first !== undefined && first.color === completedColor;
  }
  return false;
}

export default function PieChart({
  containerStyle,
  completedColor,
  incompleteColor,
  singleSliceRole,
  entranceDurationMs = 1800,
  entranceDelayMs = 0,
  completedSliceDelayMs = 200,
  enableCompletedSliceEmphasis = true,
  radius,
  data,
  ...rest
}: PieChartWrapperProps) {
  const r = radius ?? 120;
  const maxExtra = Math.max(6, r / 8);

  const [emphasizeCompleted, setEmphasizeCompleted] = useState(false);
  const [extraRadiusValue, setExtraRadiusValue] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const entrance = useSharedValue(0);
  const emphasisAnim = useRef(new Animated.Value(0)).current;

  const resolvedData = useMemo(
    () => mergeHabitColors(data, completedColor, incompleteColor, singleSliceRole),
    [data, completedColor, incompleteColor, singleSliceRole],
  );

  const canEmphasize = useMemo(
    () =>
      enableCompletedSliceEmphasis &&
      shouldEmphasizeCompletedSlice(resolvedData, completedColor),
    [enableCompletedSliceEmphasis, resolvedData, completedColor],
  );

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (!cancelled) setReduceMotion(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => {
      setReduceMotion(v);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    setEmphasizeCompleted(false);
    emphasisAnim.setValue(0);
    setExtraRadiusValue(0);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (reduceMotion) {
      entrance.value = 1;
      if (canEmphasize) {
        timeoutId = setTimeout(() => setEmphasizeCompleted(true), completedSliceDelayMs);
      }
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    entrance.value = 0;
    entrance.value = withDelay(
      entranceDelayMs,
      withTiming(1, {
        duration: entranceDurationMs,
        easing: Easing.out(Easing.cubic),
      }),
    );

    if (canEmphasize) {
      const waitMs =
        entranceDelayMs + entranceDurationMs + completedSliceDelayMs;
      timeoutId = setTimeout(() => setEmphasizeCompleted(true), waitMs);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    resolvedData,
    canEmphasize,
    entranceDurationMs,
    entranceDelayMs,
    completedSliceDelayMs,
    reduceMotion,
    entrance,
  ]);

  useEffect(() => {
    if (!emphasizeCompleted) {
      emphasisAnim.setValue(0);
      setExtraRadiusValue(0);
      return;
    }
    const id = emphasisAnim.addListener(({ value }) => {
      setExtraRadiusValue(value * maxExtra);
    });
    Animated.spring(emphasisAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 95,
      friction: 11,
    }).start();
    return () => emphasisAnim.removeListener(id);
  }, [emphasizeCompleted, maxExtra, emphasisAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [
      {
        scale: interpolate(entrance.value, [0, 1], [ENTRANCE_SCALE_FROM, 1]),
      },
    ],
  }));

  const emphasize = emphasizeCompleted && canEmphasize;

  const displayData = useMemo(() => {
    if (!emphasize || resolvedData.length === 0) return resolvedData;
    return resolvedData.map((item, i) =>
      i === 0 ? { ...item, focused: true } : item,
    );
  }, [emphasize, resolvedData]);

  const fixedSize = (r + maxExtra) * 2;

  return (
    <View
      style={[
        containerStyle,
        { width: fixedSize, height: fixedSize, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Reanimated.View style={animatedStyle}>
        <GiftedPieChart
          {...rest}
          data={displayData}
          radius={r}
          focusOnPress={false}
          sectionAutoFocus
          extraRadius={extraRadiusValue}
          paddingHorizontal={maxExtra}
          paddingVertical={maxExtra}
          isAnimated={false}
        />
      </Reanimated.View>
    </View>
  );
}
