export const ENABLE_HABIT_SCREENSHOT_MOCKS = true;

export function buildActivityScreenshotDateKeys(
  timeInterval: "Week" | "Month" | "Year" = "Year",
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
  return keys.filter((_, idx) => {
    if (idx % 9 === 0) return false;
    if (idx % 14 === 0) return false;
    if (idx % 6 === 0 && idx % 12 !== 0) return false;
    return true;
  });
}
