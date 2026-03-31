export type ChartDataPoint = { value: number };

export type ChartDataSet = {
  data: ChartDataPoint[];
  color?: string;
  startFillColor?: string;
  endFillColor?: string;
};

export type ChartYScale = 'count' | 'percent';

export type ChartProps = {
  dataSet: ChartDataSet[];
  labels?: string[];
  hideXAxisLabels?: boolean;
  spacing?: number;
  color1?: string;
  color2?: string;
  startFillColor1?: string;
  startFillColor2?: string;
  endFillColor1?: string;
  endFillColor2?: string;
  startOpacity?: number;
  endOpacity?: number;
  noOfSections?: number;
  yAxisTitle?: string;
  yAxisLabelSuffix?: string;
  yAxisLabelPrefix?: string;
  formatYLabel?: (label: string) => string;
  yScale?: ChartYScale;
  entranceDelayMs?: number;
};
