import { Text } from 'react-native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { isIoniconsGlyphName } from '../ActivityTracker/iconKind';
import {
  ICON_SERIAL_SEPARATOR,
  VECTOR_ICON_COMPONENTS,
  type VectorIconFamily,
} from './habitIconCatalog';

export type ParsedHabitIcon =
  | { kind: 'vector'; family: VectorIconFamily; name: string }
  | { kind: 'ion'; name: string }
  | { kind: 'emoji'; char: string };

export function parseHabitIcon(icon: string | undefined | null): ParsedHabitIcon {
  const s = typeof icon === 'string' ? icon : '';
  if (s === '') {
    return { kind: 'emoji', char: '\u2753' };
  }
  const sep = ICON_SERIAL_SEPARATOR;
  if (s.includes(sep)) {
    const i = s.indexOf(sep);
    const family = s.slice(0, i) as VectorIconFamily;
    const name = s.slice(i + sep.length);
    if (family && name && family in VECTOR_ICON_COMPONENTS) {
      return { kind: 'vector', family, name };
    }
  }
  if (isIoniconsGlyphName(s)) {
    return { kind: 'ion', name: s };
  }
  return { kind: 'emoji', char: s };
}

export type HabitIconProps = {
  icon: string;
  size: number;
  color: string;
};

export function HabitIcon({ icon, size, color }: HabitIconProps) {
  const parsed = parseHabitIcon(icon);
  if (parsed.kind === 'vector') {
    if (parsed.family === 'FontAwesome5') {
      return (
        <FontAwesome5
          name={parsed.name as never}
          size={size}
          color={color}
          solid
        />
      );
    }
    if (parsed.family === 'FontAwesome6') {
      return (
        <FontAwesome6
          name={parsed.name as never}
          size={size}
          color={color}
          iconStyle="solid"
        />
      );
    }
    const Cmp = VECTOR_ICON_COMPONENTS[parsed.family];
    return (
      <Cmp name={parsed.name as never} size={size} color={color} />
    );
  }
  if (parsed.kind === 'ion') {
    const Ionicons = VECTOR_ICON_COMPONENTS.Ionicons;
    return (
      <Ionicons name={parsed.name as never} size={size} color={color} />
    );
  }
  return (
    <Text style={{ fontSize: size * 0.92, lineHeight: size * 1.05 }}>
      {parsed.char}
    </Text>
  );
}
