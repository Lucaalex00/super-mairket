// src/utils/colorUtils.js
export function getColorLuminosity(color) {
  if (!color) return 255;
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
