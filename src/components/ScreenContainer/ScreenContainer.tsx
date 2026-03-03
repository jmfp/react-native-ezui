import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import type { ScreenContainerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function ScreenContainer({
  children,
  paddingHorizontal = 16,
  paddingVertical = 16,
  gap = 16,
  style,
  refreshing = false,
  onRefresh,
}: ScreenContainerProps) {
  const theme = useEzuiTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={[
          {
            paddingHorizontal,
            paddingVertical,
            backgroundColor: theme.colors.background,
          },
          style,
        ]}
        contentContainerStyle={[{ gap }]}
        showsVerticalScrollIndicator={false}
        pullToRefreshEnabled
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
