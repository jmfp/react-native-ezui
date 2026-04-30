import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, AccessibilityInfo } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { ChartProps } from './types';
import { LineChart } from 'react-native-gifted-charts';
import Reanimated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useEzuiTheme } from '../../theme/ThemeContext';

const Y_AXIS_LABEL_WIDTH = 30;
const INITIAL_SPACING = 12;
const END_SPACING = 12;
const CURVE_OVERFLOW_TOP = 16;
const CURVE_OVERFLOW_TOP_PERCENT = 22;
const ENTRANCE_MS = 1800;
const SCALE_FROM = 0.965;

function maxAcrossDataSet(dataSet: ChartProps['dataSet']): number {
  let max = 0;
  for (const set of dataSet) {
    for (const pt of set.data) {
      const v = pt.value;
      if (typeof v === 'number' && Number.isFinite(v)) {
        max = Math.max(max, v);
      }
    }
  }
  return max;
}

function yAxisMaxWithHeadroom(dataMax: number): number {
  if (dataMax <= 0) return 1;
  const relative = Math.max(dataMax * 0.12, 1);
  const absolute = dataMax <= 1 ? 0.08 : 0;
  return dataMax + relative + absolute;
}

function clampPercentDataSet(dataSet: ChartProps['dataSet']): ChartProps['dataSet'] {
  return dataSet.map((set) => ({
    ...set,
    data: set.data.map((p) => ({
      value: Math.min(100, Math.max(0, p.value)),
    })),
  }));
}

export default function Chart({
  dataSet,
  labels = [],
  hideXAxisLabels = false,
  color1,
  startFillColor1,
  endFillColor1,
  startOpacity = 0.9,
  endOpacity = 0.2,
  noOfSections = 4,
  yAxisTitle,
  yAxisLabelSuffix = '',
  yAxisLabelPrefix = '',
  formatYLabel,
  yScale = 'count',
  entranceDelayMs = 0,
  useDataSetLineColors = false,
  skipEntranceAnimation = false,
  chartAreaMinHeight,
}: ChartProps) {
  const theme = useEzuiTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const entrance = useSharedValue(0);

  const lineColor = color1 ?? theme.colors.primary;
  const fillStart = startFillColor1 ?? lineColor;
  const fillEnd = endFillColor1 ?? lineColor;

  const displayDataSet = useMemo(
    () => (yScale === 'percent' ? clampPercentDataSet(dataSet) : dataSet),
    [dataSet, yScale],
  );

  const scaledMaxValue = useMemo(() => {
    if (yScale === 'percent') return 100;
    return yAxisMaxWithHeadroom(maxAcrossDataSet(dataSet));
  }, [dataSet, yScale]);

  const pointCount = displayDataSet[0]?.data.length ?? 1;
  const spacing = pointCount > 1
    ? (chartWidth - INITIAL_SPACING - END_SPACING) / (pointCount - 1)
    : chartWidth;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (!cancelled) setReduceMotion(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      setReduceMotion(v);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (chartWidth <= 0) return;
    if (reduceMotion || skipEntranceAnimation) {
      entrance.value = 1;
      return;
    }
    entrance.value = 0;
    entrance.value = withDelay(
      entranceDelayMs,
      withTiming(1, {
        duration: ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [
    chartWidth,
    reduceMotion,
    entranceDelayMs,
    entrance,
    skipEntranceAnimation,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [
      {
        scale: interpolate(entrance.value, [0, 1], [SCALE_FROM, 1]),
      },
    ],
  }));

  function handleLayout(e: LayoutChangeEvent) {
    setChartWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.wrap}>
      {yAxisTitle ? (
        <Text
          style={[styles.yAxisTitle, { color: theme.colors.textMuted }]}
          numberOfLines={2}
        >
          {yAxisTitle}
        </Text>
      ) : null}
      <Reanimated.View style={animatedStyle}>
        <View
          style={[
            styles.chart,
            chartAreaMinHeight != null && { minHeight: chartAreaMinHeight },
          ]}
          onLayout={handleLayout}
        >
          {chartWidth > 0 && (
            <LineChart
              areaChart
              dataSet={displayDataSet}
              width={chartWidth}
              maxValue={scaledMaxValue}
              overflowTop={
                yScale === 'percent'
                  ? CURVE_OVERFLOW_TOP_PERCENT
                  : CURVE_OVERFLOW_TOP
              }
              initialSpacing={INITIAL_SPACING}
              endSpacing={END_SPACING}
              spacing={spacing}
              {...(useDataSetLineColors
                ? {}
                : {
                    color1: lineColor,
                    color2: lineColor,
                    startFillColor1: fillStart,
                    startFillColor2: fillStart,
                    endFillColor1: fillEnd,
                    endFillColor2: fillEnd,
                  })}
              startOpacity={startOpacity}
              endOpacity={endOpacity}
              noOfSections={noOfSections}
              hideDataPoints
              isAnimated={false}
              yAxisColor="transparent"
              xAxisColor={theme.colors.textMuted}
              hideYAxisText={false}
              yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
              yAxisLabelContainerStyle={{
                alignItems: 'flex-end',
                paddingRight: 0,
              }}
              yAxisTextStyle={{
                color: theme.colors.textMuted,
                fontSize: 9,
                textAlign: 'right',
              }}
              yAxisTextNumberOfLines={1}
              yAxisLabelPrefix={yAxisLabelPrefix}
              yAxisLabelSuffix={yAxisLabelSuffix}
              formatYLabel={formatYLabel}
              xAxisLabelTexts={hideXAxisLabels ? undefined : labels}
              xAxisLabelsHeight={hideXAxisLabels ? 0 : undefined}
              xAxisLabelTextStyle={{
                color: theme.colors.textMuted,
                fontSize: 10,
              }}
              hideRules
            />
          )}
        </View>
      </Reanimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
  },
  yAxisTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chart: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
});
