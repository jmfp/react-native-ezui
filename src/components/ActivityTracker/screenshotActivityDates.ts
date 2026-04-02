const raw = process.env.EXPO_PUBLIC_SCREENSHOT_MOCKS?.trim().toLowerCase();
export const ENABLE_HABIT_SCREENSHOT_MOCKS =
  raw !== "0" && raw !== "false" && raw !== "off";

const MOCK_MIN_COMPLETION_PERCENT = 72;

function hashU32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function targetPercentForMock(
  habitId: string,
  timeInterval: "Week" | "Month" | "Year",
): number {
  const h = hashU32(`${timeInterval}|${habitId}`);
  if (timeInterval === "Week") {
    return MOCK_MIN_COMPLETION_PERCENT + (h % 23);
  }
  if (timeInterval === "Month") {
    return MOCK_MIN_COMPLETION_PERCENT + (h % 25);
  }
  return MOCK_MIN_COMPLETION_PERCENT + (h % 25);
}

function keepIndexForMock(
  habitId: string,
  idx: number,
  timeInterval: "Week" | "Month" | "Year",
): boolean {
  const target = targetPercentForMock(habitId, timeInterval);
  const roll =
    hashU32(`${habitId}\0${idx}\0${timeInterval}\0mock`) % 100;
  return roll < target;
}

export function buildActivityScreenshotDateKeys(
  timeInterval: "Week" | "Month" | "Year" = "Year",
  habitId: string,
): string[] {
  const gridDays =
    timeInterval === "Week" ? 7 : timeInterval === "Month" ? 30 : 365;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys: string[] = [];
  for (let i = gridDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    keys.push(`${y}-${m}-${day}`);
  }
  const selected = new Set<number>();
  for (let idx = 0; idx < keys.length; idx++) {
    if (keepIndexForMock(habitId, idx, timeInterval)) {
      selected.add(idx);
    }
  }
  const minRequired = Math.ceil(
    (gridDays * MOCK_MIN_COMPLETION_PERCENT) / 100,
  );
  if (selected.size >= minRequired) {
    return keys.filter((_, idx) => selected.has(idx));
  }
  const notSelected: number[] = [];
  for (let idx = 0; idx < keys.length; idx++) {
    if (!selected.has(idx)) notSelected.push(idx);
  }
  notSelected.sort(
    (a, b) =>
      hashU32(`${habitId}|fill|${a}`) - hashU32(`${habitId}|fill|${b}`),
  );
  const need = minRequired - selected.size;
  for (let i = 0; i < need && i < notSelected.length; i++) {
    selected.add(notSelected[i]);
  }
  return keys.filter((_, idx) => selected.has(idx));
}
