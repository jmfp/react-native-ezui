import { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import type { MarkdownComposerProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

function insertAroundSelection(
  value: string,
  start: number,
  end: number,
  wrap: string
): { next: string; cursor: number } {
  const selected = value.slice(start, end);
  const inner = selected.length > 0 ? selected : '';
  const insertion = `${wrap}${inner}${wrap}`;
  const next = value.slice(0, start) + insertion + value.slice(end);
  const cursor =
    inner.length > 0 ? start + wrap.length + inner.length + wrap.length : start + wrap.length;
  return { next, cursor };
}

function insertLinePrefix(value: string, start: number, prefix: string) {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const cursor = start + prefix.length;
  return { next, cursor };
}

function insertCodeFence(
  value: string,
  start: number,
  end: number,
  lang: string
): { next: string; cursor: number } {
  const selected = value.slice(start, end);
  const fenceOpen = lang.trim() ? `\`\`\`${lang.trim()}\n` : '```\n';
  const fenceClose = '\n```';
  const inner = selected.length > 0 ? selected : '';
  const insertion =
    inner.length > 0
      ? `${fenceOpen}${inner}${fenceClose}`
      : `${fenceOpen}${fenceClose}`;
  const next = value.slice(0, start) + insertion + value.slice(end);
  const cursor =
    inner.length > 0
      ? start + insertion.length
      : start + fenceOpen.length;
  return { next, cursor };
}

export function MarkdownComposer({
  value,
  onChangeText,
  placeholder,
  minHeight = 160,
  maxLength,
  editable = true,
  style,
  inputStyle,
  error,
  errorStyle,
}: MarkdownComposerProps) {
  const theme = useEzuiTheme();
  const selRef = useRef({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(
    undefined
  );

  const onSelectionChange: NonNullable<
    TextInputProps['onSelectionChange']
  > = (e) => {
    selRef.current = e.nativeEvent.selection;
    setSelection(e.nativeEvent.selection);
  };

  const wrapSelection = useCallback(
    (wrap: string) => {
      const { start, end } = selRef.current;
      const { next, cursor } = insertAroundSelection(value, start, end, wrap);
      onChangeText(next);
      const nextSelection = { start: cursor, end: cursor };
      selRef.current = nextSelection;
      setSelection(nextSelection);
      inputRef.current?.focus();
    },
    [onChangeText, value]
  );

  const bulletLine = useCallback(() => {
    const { start } = selRef.current;
    const { next, cursor } = insertLinePrefix(value, start, '- ');
    onChangeText(next);
    const nextSelection = { start: cursor, end: cursor };
    selRef.current = nextSelection;
    setSelection(nextSelection);
    inputRef.current?.focus();
  }, [onChangeText, value]);

  const codeFence = useCallback(
    (lang: string) => {
      const { start, end } = selRef.current;
      const { next, cursor } = insertCodeFence(value, start, end, lang);
      onChangeText(next);
      const nextSelection = { start: cursor, end: cursor };
      selRef.current = nextSelection;
      setSelection(nextSelection);
      inputRef.current?.focus();
    },
    [onChangeText, value]
  );

  const borderColor = error ? '#ef4444' : theme.colors.border;

  const composedInputStyle = StyleSheet.flatten([
    styles.input,
    {
      minHeight,
      backgroundColor: theme.colors.surface,
      borderColor,
      color: theme.colors.text,
    },
    inputStyle,
  ]) as TextStyle;

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => wrapSelection('**')}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Bold"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>B</Text>
        </Pressable>
        <Pressable
          onPress={() => wrapSelection('*')}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Italic"
        >
          <Text
            style={[
              styles.toolLabel,
              { fontStyle: 'italic', color: theme.colors.text },
            ]}
          >
            I
          </Text>
        </Pressable>
        <Pressable
          onPress={bulletLine}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Bullet list"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>•</Text>
        </Pressable>
        <Pressable
          onPress={() => codeFence('')}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Code block"
        >
          <Text
            style={[
              styles.toolLabel,
              styles.toolMono,
              { color: theme.colors.text },
            ]}
          >
            {'</>'}
          </Text>
        </Pressable>
      </View>
      <TextInput
        ref={inputRef}
        editable={editable}
        multiline
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
        maxLength={maxLength}
        style={composedInputStyle}
        selection={selection}
        selectionColor={theme.colors.primary}
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        textContentType="none"
        importantForAutofill={Platform.OS === 'android' ? 'no' : undefined}
      />
      {error ? (
        <Text style={[styles.fieldError, errorStyle]} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 8,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
  },
  toolBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  toolBtnPressed: {
    opacity: 0.7,
  },
  toolLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  toolMono: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
  fieldError: {
    fontSize: 12,
    marginLeft: 4,
    color: '#ef4444',
  },
});
