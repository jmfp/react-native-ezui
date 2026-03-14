import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  View,
  StyleSheet,
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
  scrollable = true,
}: ScreenContainerProps) {
  const theme = useEzuiTheme();
  const ScrollViewComponent = scrollable ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollViewComponent
        style={[
          {
            flex: 1,
            paddingHorizontal,
            paddingVertical,
            gap,
            backgroundColor: theme.colors.background,
          },
          style,
        ]}
        contentContainerStyle={[{ gap }]}
        showsVerticalScrollIndicator={false}
        // pullToRefreshEnabled
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {children}
      </ScrollViewComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
