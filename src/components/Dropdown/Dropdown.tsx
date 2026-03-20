import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import type { DropdownProps } from './types';
import { Input } from '../Input';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Dropdown({
  options,
  value,
  onChange,
  onOpenChange,
  style,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue =
    options.find((o) => o.value === value)?.label ?? String(value ?? '');
  const theme = useEzuiTheme();
  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(next);
  };
  return (
    <Pressable onPress={toggle} style={style}>
      <View pointerEvents="none">
        <Input
          placeholder="Select an option"
          value={displayValue}
          onChangeText={() => {}}
          editable={false}
          style={style}
        />
      </View>
      {isOpen && (
        <ScrollView
          style={[styles.options, { backgroundColor: theme.colors.surface }]}
        >
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setIsOpen(false);
                onOpenChange?.(false);
              }}
            >
              <Text style={[styles.option, { color: theme.colors.text }]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  options: {
    maxHeight: 200,
  },
  option: {
    padding: 16,
  },
});
