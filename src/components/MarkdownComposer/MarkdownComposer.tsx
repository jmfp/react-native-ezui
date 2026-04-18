import { useCallback, useRef } from 'react';
import {
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
  const cursor = start + wrap.length + inner.length + wrap.length;
  return { next, cursor };
}

function insertLinePrefix(value: string, start: number, prefix: string) {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const cursor = start + prefix.length;
  return { next, cursor };
}

function lineStart(s: string, index: number): number {
  return s.lastIndexOf('\n', index - 1) + 1;
}

function lineEnd(s: string, index: number): number {
  const j = s.indexOf('\n', index);
  return j === -1 ? s.length : j;
}

function singleNewlineInsert(prev: string, next: string): number | null {
  if (next.length !== prev.length + 1) return null;
  let i = 0;
  while (i < prev.length && prev[i] === next[i]) i += 1;
  if (next[i] !== '\n') return null;
  if (next.slice(i + 1) !== prev.slice(i)) return null;
  return i;
}

function cursorAfterStripDashPrefix(
  dashPrefixStart: number,
  start: number
): number {
  if (start <= dashPrefixStart) return start;
  if (start < dashPrefixStart + 2) return dashPrefixStart;
  return start - 2;
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

  const onSelectionChange: NonNullable<
    TextInputProps['onSelectionChange']
  > = (e) => {
    selRef.current = e.nativeEvent.selection;
  };

  const applySelection = useCallback((start: number, end: number) => {
    requestAnimationFrame(() => {
      inputRef.current?.setNativeProps({
        selection: { start, end },
      });
    });
  }, []);

  const wrapSelection = useCallback(
    (wrap: string) => {
      const { start, end } = selRef.current;
      const { next } = insertAroundSelection(value, start, end, wrap);
      onChangeText(next);
    },
    [onChangeText, value]
  );

  const toggleBulletLine = useCallback(() => {
    const { start } = selRef.current;
    const ls = lineStart(value, start);
    const le = lineEnd(value, start);
    const line = value.slice(ls, le);
    const m = line.match(/^(\s*)([\s\S]*)$/);
    const lw = m?.[1] ?? '';
    const rest = m?.[2] ?? line;
    if (/^-\s/.test(rest)) {
      const stripped = lw + rest.replace(/^-\s/, '');
      const next = value.slice(0, ls) + stripped + value.slice(le);
      onChangeText(next);
      const newPos = cursorAfterStripDashPrefix(ls + lw.length, start);
      applySelection(newPos, newPos);
    } else {
      const { next, cursor } = insertLinePrefix(value, start, '- ');
      onChangeText(next);
      applySelection(cursor, cursor);
    }
  }, [applySelection, onChangeText, value]);

  const handleChangeText = useCallback(
    (next: string) => {
      const prev = value;
      let transformed = next;
      const ins = singleNewlineInsert(prev, next);
      if (ins !== null) {
        const ls = lineStart(prev, ins);
        const le = lineEnd(prev, ins);
        const afterC = prev.slice(ins, le);
        if (afterC !== '') {
          onChangeText(transformed);
          return;
        }
        const lineSlice = prev.slice(ls, le);
        if (/^\s*-\s*$/.test(lineSlice) && ins === le) {
          transformed = prev.slice(0, ls) + '\n' + prev.slice(le);
          onChangeText(transformed);
          return;
        }
        if (/^\s*-\s+\S/.test(lineSlice) && ins === le) {
          transformed = prev.slice(0, ins) + '\n- ' + prev.slice(ins);
          onChangeText(transformed);
          return;
        }
      }
      onChangeText(transformed);
    },
    [onChangeText, value]
  );

  const insertLink = useCallback(() => {
    const { start, end } = selRef.current;
    const selected = value.slice(start, end) || 'link text';
    const insertion = `[${selected}](https://)`;
    onChangeText(value.slice(0, start) + insertion + value.slice(end));
  }, [onChangeText, value]);

  const insertImage = useCallback(() => {
    const { start, end } = selRef.current;
    const insertion = '![caption](https://)';
    onChangeText(value.slice(0, start) + insertion + value.slice(end));
  }, [onChangeText, value]);

  const insertCodeFence = useCallback(() => {
    const { start, end } = selRef.current;
    const selected = value.slice(start, end) || ' ';
    const fence = '```text';
    const insertion = `${fence}\n${selected}\n\`\`\`\n`;
    onChangeText(value.slice(0, start) + insertion + value.slice(end));
  }, [onChangeText, value]);

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
          onPress={toggleBulletLine}
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
          onPress={insertLink}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Insert link"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>Link</Text>
        </Pressable>
        <Pressable
          onPress={insertImage}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Insert image"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>Img</Text>
        </Pressable>
        <Pressable
          onPress={insertCodeFence}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: theme.colors.border },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Insert code block"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>{'{}'}</Text>
        </Pressable>
      </View>
      <TextInput
        ref={inputRef}
        editable={editable}
        multiline
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={handleChangeText}
        onSelectionChange={onSelectionChange}
        maxLength={maxLength}
        style={composedInputStyle}
        selectionColor={theme.colors.primary}
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
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
