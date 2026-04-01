import type { ComponentType } from 'react';
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';

export const ICON_SERIAL_SEPARATOR = '::' as const;

export type VectorIconFamily =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'Fontisto'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export const VECTOR_ICON_FAMILIES: readonly VectorIconFamily[] = [
  'AntDesign',
  'Entypo',
  'EvilIcons',
  'Feather',
  'Fontisto',
  'FontAwesome',
  'FontAwesome5',
  'FontAwesome6',
  'Foundation',
  'Ionicons',
  'MaterialCommunityIcons',
  'MaterialIcons',
  'Octicons',
  'SimpleLineIcons',
  'Zocial',
] as const;

export const VECTOR_ICON_COMPONENTS: Record<VectorIconFamily, ComponentType<any>> =
  {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

export type VectorIconEntry = {
  family: VectorIconFamily;
  name: string;
  id: string;
};

let cachedVectorEntries: VectorIconEntry[] | null = null;

export function getAllVectorIconEntries(): VectorIconEntry[] {
  if (cachedVectorEntries) {
    return cachedVectorEntries;
  }
  const out: VectorIconEntry[] = [];
  for (const family of VECTOR_ICON_FAMILIES) {
    const Cmp = VECTOR_ICON_COMPONENTS[family];
    const gm = (Cmp as { glyphMap?: Record<string, number> })?.glyphMap;
    if (!gm) continue;
    for (const name of Object.keys(gm)) {
      out.push({
        family,
        name,
        id: `${family}${ICON_SERIAL_SEPARATOR}${name}`,
      });
    }
  }
  out.sort(
    (a, b) =>
      a.family.localeCompare(b.family) || a.name.localeCompare(b.name),
  );
  cachedVectorEntries = out;
  return cachedVectorEntries;
}
