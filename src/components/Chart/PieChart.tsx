import { useEffect, useMemo, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PieChart as GiftedPieChart } from "react-native-gifted-charts";
import type { PieChartPropsType, pieDataItem } from "gifted-charts-core";

export type { PieChartPropsType, pieDataItem } from "gifted-charts-core";

export type PieChartWrapperProps = PieChartPropsType & {
  containerStyle?: StyleProp<ViewStyle>;
  completedColor?: string;
  incompleteColor?: string;
  singleSliceRole?: "completed" | "incomplete";
  entranceDurationMs?: number;
  completedSliceDelayMs?: number;
  enableCompletedSliceEmphasis?: boolean;
};

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
  entranceDurationMs = 420,
  completedSliceDelayMs = 80,
  enableCompletedSliceEmphasis = true,
  radius,
  data,
  ...rest
}: PieChartWrapperProps) {
  const r = radius ?? 120;
  const [emphasizeCompleted, setEmphasizeCompleted] = useState(false);
  const entrance = useSharedValue(0);

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
    setEmphasizeCompleted(false);
    entrance.value = 0;
    entrance.value = withTiming(
      1,
      {
        duration: entranceDurationMs,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (!finished || !canEmphasize) return;
        const schedule = () => {
          setTimeout(() => {
            setEmphasizeCompleted(true);
          }, completedSliceDelayMs);
        };
        runOnJS(schedule)();
      },
    );
  }, [resolvedData, canEmphasize, entranceDurationMs, completedSliceDelayMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ scale: 0.88 + 0.12 * entrance.value }],
  }));

  const emphasize = emphasizeCompleted && canEmphasize;

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <GiftedPieChart
        {...rest}
        data={resolvedData}
        radius={r}
        focusOnPress={false}
        focusedPieIndex={emphasize ? 0 : -1}
        extraRadius={emphasize ? Math.max(6, r / 10) : 0}
      />
    </Animated.View>
  );
}
