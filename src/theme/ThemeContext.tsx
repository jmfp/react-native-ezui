import React, { createContext, useContext, useMemo } from 'react';
import type { EzuiTheme, EzuiThemeOverride } from './types';
import { defaultTheme } from './defaultTheme';

const EzuiThemeContext = createContext<EzuiTheme | null>(null);

type ThemeProviderProps = {
  theme?: EzuiThemeOverride;
  children: React.ReactNode;
};

export function EzuiThemeProvider({
  theme: userTheme,
  children,
}: ThemeProviderProps) {
  const theme = useMemo(() => {
    if (!userTheme) return defaultTheme;
    return {
      colors: { ...defaultTheme.colors, ...userTheme.colors },
      constants: { ...defaultTheme.constants, ...userTheme.constants },
    };
  }, [userTheme]);

  return (
    <EzuiThemeContext.Provider value={theme}>
      {children}
    </EzuiThemeContext.Provider>
  );
}

export function useEzuiTheme(): EzuiTheme {
  const theme = useContext(EzuiThemeContext);
  if (!theme) {
    throw new Error('useEzuiTheme must be used within EzuiThemeProvider');
  }
  return theme;
}
