import { Ionicons } from '@expo/vector-icons';

export function isIoniconsGlyphName(name: string): boolean {
  const gm = (Ionicons as any)?.glyphMap;
  return typeof name === 'string' && !!gm && Object.prototype.hasOwnProperty.call(gm, name);
}
