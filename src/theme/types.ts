export type EzuiColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  text: string;
  textMuted: string;
  surface: string;
  shadow: string;
  border: string;
};

export type EzuiTheme = {
  colors: EzuiColors;
  constants: EzuiConstants;
};

export type EzuiThemeOverride = {
  colors?: Partial<EzuiColors>;
  constants?: Partial<EzuiConstants>;
};

export type EzuiConstants = {
  borderRadius: number;
  fontFamily: string;
};
