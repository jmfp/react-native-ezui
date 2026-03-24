import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { ChartProps } from './types';
import { LineChart } from 'react-native-gifted-charts';
import { useEzuiTheme } from '../../theme/ThemeContext';

const Y_AXIS_WIDTH = 0;
const INITIAL_SPACING = 12;
const END_SPACING = 12;

export default function Chart({
  dataSet,
  labels,
  color1,
  startFillColor1,
  endFillColor1,
  startOpacity = 0.9,
  endOpacity = 0.2,
  noOfSections = 4,
}: ChartProps) {
  const theme = useEzuiTheme();
  const [chartWidth, setChartWidth] = useState(0);

  const lineColor = color1 ?? theme.colors.primary;
  const fillStart = startFillColor1 ?? lineColor;
  const fillEnd = endFillColor1 ?? lineColor;

  const pointCount = dataSet[0]?.data.length ?? 1;
  const spacing = pointCount > 1
    ? (chartWidth - INITIAL_SPACING - END_SPACING) / (pointCount - 1)
    : chartWidth;

  function handleLayout(e: LayoutChangeEvent) {
    setChartWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.chart} onLayout={handleLayout}>
      {chartWidth > 0 && (
        <LineChart
          areaChart
          dataSet={dataSet}
          width={chartWidth}
          initialSpacing={INITIAL_SPACING}
          endSpacing={END_SPACING}
          spacing={spacing}
          color1={lineColor}
          color2={lineColor}
          startFillColor1={fillStart}
          startFillColor2={fillStart}
          endFillColor1={fillEnd}
          endFillColor2={fillEnd}
          startOpacity={startOpacity}
          endOpacity={endOpacity}
          noOfSections={noOfSections}
          hideDataPoints
          yAxisColor="transparent"
          xAxisColor={theme.colors.textMuted}
          hideYAxisText
          yAxisLabelWidth={Y_AXIS_WIDTH}
          xAxisLabelTexts={labels}
          xAxisLabelTextStyle={{
            color: theme.colors.textMuted,
            fontSize: 10,
          }}
          hideRules
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
});
