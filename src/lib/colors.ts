/**
 * Brand palette — keep in sync with the CSS variables at the top of globals.css
 *   Slate Grey #69747C · Sage Green #6BAA75 · Radioactive Grass #84DD63 · Chartreuse #CBFF4D
 */
export const COLORS = {
  ink: "#1E2622",
  slate: "#69747C",
  sage: "#6BAA75",
  grass: "#84DD63",
  lime: "#CBFF4D",
  forest: "#2E5E3A",
  mist: "#F3F7F3",
  grid: "#EEF1EE",
  axis: "#9AA3A9",
  down: "#D9655B",
};

/** Order used for chart series (pie slices, bars, categories) */
export const PALETTE = ["#6BAA75", "#84DD63", "#69747C", "#CBFF4D", "#2E5E3A", "#A9B3B9", "#B7EC8F", "#4C8A58"];

/** Light → dark scale for heatmaps */
export const SCALE = ["#F3F7F3", "#E2F4D3", "#C2EAA2", "#84DD63", "#6BAA75", "#2E5E3A"];

/** Text colour that stays readable on top of a palette colour */
export function onColor(hex: string) {
  return ["#CBFF4D", "#84DD63", "#B7EC8F", "#E2F4D3", "#C2EAA2", "#F3F7F3", "#A9EC58"].includes(hex.toUpperCase()) ? COLORS.ink : "#FFFFFF";
}
