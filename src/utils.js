export const now = () =>
  new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

// Converts letters to their alphabet position (a=1, z=26), then sums all numbers.
// A leading "-" negates the total.
export const extractNum = str => {
  if (!str) return null;
  const negative = str.trimStart().startsWith("-");
  const expanded = str.replace(/[a-zA-Z]/g, c => c.toLowerCase().charCodeAt(0) - 96);
  const nums = expanded.match(/-?\d+(\.\d+)?/g);
  if (!nums) return null;
  const sum = nums.reduce((s, n) => s + parseFloat(n), 0);
  return negative && sum > 0 ? -sum : sum;
};

export const calcTotal = lines => {
  let sum = 0, any = false;
  for (const l of lines) {
    const n = extractNum(l.value);
    if (n !== null) { sum += n; any = true; }
  }
  return any ? sum : null;
};

export const fmtNum = n => {
  if (n === null) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

// Simple easing functions for animations
export const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeOut   = t => 1 - Math.pow(1 - t, 3);

// Runs a rAF animation loop for a given duration (ms).
// onFrame receives progress 0–1, onDone fires when complete.
export const animate = (duration, onFrame, onDone) => {
  let start = null;
  const tick = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    onFrame(p);
    if (p < 1) requestAnimationFrame(tick);
    else onDone();
  };
  return requestAnimationFrame(tick);
};