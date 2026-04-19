import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
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
  livePreview = false,
  renderMarkdownPreview,
  livePreviewDebounceMs = 120,
  livePreviewMaxHeight = 320,
  accentColor,
}: MarkdownComposerProps) {
  const theme = useEzuiTheme();
  const selRef = useRef({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const imageUrlInputRef = useRef<TextInput>(null);
  const [imageUrlOpen, setImageUrlOpen] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [previewMarkdown, setPreviewMarkdown] = useState(value);

  useEffect(() => {
    if (!livePreview) {
      return;
    }
    const id = setTimeout(() => {
      setPreviewMarkdown(value);
    }, livePreviewDebounceMs);
    return () => clearTimeout(id);
  }, [value, livePreview, livePreviewDebounceMs]);

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

  const toggleImageUrlField = useCallback(() => {
    setImageUrlOpen((o) => {
      const next = !o;
      if (next) {
        setImageUrlDraft('');
        requestAnimationFrame(() => imageUrlInputRef.current?.focus());
      }
      return next;
    });
  }, []);

  const applyImageFromUrlField = useCallback(() => {
    const raw = imageUrlDraft.trim();
    if (!raw) {
      return;
    }
    const esc = raw.replace(/\)/g, '%29');
    const { start, end } = selRef.current;
    const insertion = `![Image](${esc})`;
    const next = value.slice(0, start) + insertion + value.slice(end);
    onChangeText(next);
    const pos = start + insertion.length;
    applySelection(pos, pos);
    setImageUrlDraft('');
    setImageUrlOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [applySelection, imageUrlDraft, onChangeText, value]);

  const insertCodeFence = useCallback(() => {
    const { start, end } = selRef.current;
    const selected = value.slice(start, end) || ' ';
    const fence = '```text';
    const insertion = `${fence}\n${selected}\n\`\`\`\n`;
    onChangeText(value.slice(0, start) + insertion + value.slice(end));
  }, [onChangeText, value]);

  const outlineColor = accentColor ?? theme.colors.border;
  const selectionTint = accentColor ?? theme.colors.primary;
  const inputBorderColor = error ? '#ef4444' : outlineColor;

  const composedInputStyle = StyleSheet.flatten([
    styles.input,
    {
      minHeight,
      backgroundColor: theme.colors.surface,
      borderColor: inputBorderColor,
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
            { borderColor: outlineColor },
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
            { borderColor: outlineColor },
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
            { borderColor: outlineColor },
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
            { borderColor: outlineColor },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Insert link"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>Link</Text>
        </Pressable>
        <Pressable
          onPress={toggleImageUrlField}
          style={({ pressed }) => [
            styles.toolBtn,
            {
              borderColor: outlineColor,
              backgroundColor: imageUrlOpen ? theme.colors.surface : undefined,
            },
            pressed && styles.toolBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add image from URL"
        >
          <Text style={[styles.toolLabel, { color: theme.colors.text }]}>Img</Text>
        </Pressable>
        <Pressable
          onPress={insertCodeFence}
          style={({ pressed }) => [
            styles.toolBtn,
            { borderColor: outlineColor },
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
        selectionColor={selectionTint}
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
      />
      {imageUrlOpen ? (
        <View style={styles.imageUrlRow}>
          <TextInput
            ref={imageUrlInputRef}
            editable={editable}
            value={imageUrlDraft}
            onChangeText={setImageUrlDraft}
            placeholder="https://…"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            style={[
              styles.imageUrlInput,
              {
                backgroundColor: theme.colors.surface,
                borderColor: outlineColor,
                color: theme.colors.text,
              },
            ]}
            selectionColor={selectionTint}
            onSubmitEditing={() => applyImageFromUrlField()}
            returnKeyType="done"
          />
          <Pressable
            onPress={() => applyImageFromUrlField()}
            style={({ pressed }) => [
              styles.imageUrlAddBtn,
              { borderColor: outlineColor, opacity: pressed ? 0.75 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Insert image"
          >
            <Text style={[styles.toolLabel, { color: selectionTint }]}>
              Add
            </Text>
          </Pressable>
        </View>
      ) : null}
      {livePreview && renderMarkdownPreview ? (
        <View
          style={[
            styles.previewSection,
            { borderColor: outlineColor, backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.previewLabel, { color: theme.colors.textMuted }]}>
            Preview
          </Text>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={[styles.previewScroll, { maxHeight: livePreviewMaxHeight }]}
            keyboardShouldPersistTaps="handled"
          >
            {renderMarkdownPreview(
              previewMarkdown.trim()
                ? previewMarkdown
                : '_Start writing to see formatted text._',
            )}
          </ScrollView>
        </View>
      ) : null}
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
  imageUrlRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageUrlInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  imageUrlAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fieldError: {
    fontSize: 12,
    marginLeft: 4,
    color: '#ef4444',
  },
  previewSection: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  previewScroll: {
    width: '100%',
  },
});
