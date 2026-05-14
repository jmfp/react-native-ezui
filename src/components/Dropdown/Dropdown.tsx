import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { DropdownProps } from './types';
import { Input } from '../Input';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Dropdown({
  options,
  value,
  onChange,
  onOpenChange,
  placeholder = 'Select an option',
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
    <Pressable onPress={toggle} style={[styles.outer, style]}>
      <View style={styles.triggerRow}>
        <View style={styles.inputFlex} pointerEvents="none">
          <Input
            placeholder={placeholder}
            value={displayValue}
            onChangeText={() => {}}
            editable={false}
            style={style}
          />
        </View>
        <View style={styles.chevronWrap} pointerEvents="none">
          <Ionicons
            name="chevron-down"
            size={22}
            color={theme.colors.textMuted}
            style={{
              transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
            }}
          />
        </View>
      </View>
      {isOpen && (
        <ScrollView
          style={[styles.options, { backgroundColor: theme.colors.surface }]}
          showsVerticalScrollIndicator={false}
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
  outer: {
    width: '100%',
  },
  triggerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
    minWidth: 0,
  },
  chevronWrap: {
    marginLeft: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    maxHeight: 200,
    marginTop: 16,
    borderRadius: 16,
  },
  option: {
    padding: 16,
  },
});
