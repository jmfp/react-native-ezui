import { View, StyleSheet } from 'react-native';
import type { ChartProps } from './types';
import { LineChart } from 'react-native-gifted-charts';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Chart({ dataSet, labels: _labels }: ChartProps) {
  const theme = useEzuiTheme();
  return (
    <View style={styles.chart}>
      <LineChart
        areaChart
        curved
        dataSet={dataSet}
        color1={theme.colors.primary}
        color2={theme.colors.primary}
        startFillColor1={theme.colors.primary}
        startFillColor2={theme.colors.primary}
        endFillColor1={theme.colors.primary}
        endFillColor2={theme.colors.primary}
        startOpacity={0.9}
        endOpacity={0.2}
        noOfSections={4}
        spacing={32}
        hideDataPoints
        yAxisColor={theme.colors.text}
        xAxisColor={theme.colors.text}
        yAxisTextStyle={{ color: theme.colors.text }}
        hideRules
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    // flex: 1,
    width: '100%',
    height: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
