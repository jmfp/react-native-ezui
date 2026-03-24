import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
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

  const entrance = useRef(new Animated.Value(0)).current;
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
    setEmphasizeCompleted(false);
    emphasisAnim.setValue(0);
    setExtraRadiusValue(0);
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: entranceDurationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || !canEmphasize) return;
      setTimeout(() => setEmphasizeCompleted(true), completedSliceDelayMs);
    });
  }, [resolvedData, canEmphasize, entranceDurationMs, completedSliceDelayMs]);

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
      tension: 180,
      friction: 7,
    }).start();
    return () => emphasisAnim.removeListener(id);
  }, [emphasizeCompleted, maxExtra]);

  const opacity = entrance;
  const scale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

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
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <GiftedPieChart
          {...rest}
          data={displayData}
          radius={r}
          focusOnPress={false}
          sectionAutoFocus
          extraRadius={extraRadiusValue}
          paddingHorizontal={maxExtra}
          paddingVertical={maxExtra}
        />
      </Animated.View>
    </View>
  );
}
