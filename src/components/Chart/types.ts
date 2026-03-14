export type ChartDataPoint = { value: number };

export type ChartDataSet = {
  data: ChartDataPoint[];
  color?: string;
  startFillColor?: string;
  endFillColor?: string;
};

export type ChartProps = {
  dataSet: ChartDataSet[];
  labels: string[];
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
};
