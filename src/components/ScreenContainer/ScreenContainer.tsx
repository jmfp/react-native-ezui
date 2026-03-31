import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { ScreenContainerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function ScreenContainer({
  children,
  paddingHorizontal = 16,
  paddingVertical = 16,
  gap = 16,
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  scrollable = true,
  keyboardVerticalOffset = 0,
}: ScreenContainerProps) {
  const theme = useEzuiTheme();
  const backgroundColor = theme.colors.background;
  const paddedContent = {
    paddingHorizontal,
    paddingVertical,
    gap,
  };
  const scrollViewFrameStyle = { flex: 1 as const, backgroundColor };
  const scrollContentStyle = [
    paddedContent,
    contentContainerStyle,
    style,
  ];
  const staticOuterStyle = [
    {
      flex: 1,
      paddingHorizontal,
      paddingVertical,
      gap,
      backgroundColor,
    },
    contentContainerStyle,
    style,
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {scrollable ? (
          <ScrollView
            style={scrollViewFrameStyle}
            contentContainerStyle={scrollContentStyle}
            showsVerticalScrollIndicator={false}
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
        ) : (
          <View style={staticOuterStyle}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
