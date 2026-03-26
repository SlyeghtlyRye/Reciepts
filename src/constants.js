export const PRINTER_H = 148;

export const TORN_CLIP = `polygon(
  0% 0%, 100% 0%,
  100% 99%, 99% 100%, 97% 99%, 95% 100%, 93% 99%, 91% 100%,
  89% 99%, 87% 100%, 85% 99%, 83% 100%, 81% 99%, 79% 100%,
  77% 99%, 75% 100%, 73% 99%, 71% 100%, 69% 99%, 67% 100%,
  65% 99%, 63% 100%, 61% 99%, 59% 100%, 57% 99%, 55% 100%,
  53% 99%, 51% 100%, 49% 99%, 47% 100%, 45% 99%, 43% 100%,
  41% 99%, 39% 100%, 37% 99%, 35% 100%, 33% 99%, 31% 100%,
  29% 99%, 27% 100%, 25% 99%, 23% 100%, 21% 99%, 19% 100%,
  17% 99%, 15% 100%, 13% 99%, 11% 100%, 9% 99%, 7% 100%,
  5% 99%, 3% 100%, 1% 99%, 0% 100%
)`;

export const PAPER_WIDTH = 340;

export const editInputStyle = {
  border: "none",
  background: "#fffde7",
  fontFamily: "'Courier New', monospace",
  fontSize: 13,
  outline: "none",
  padding: "1px 2px",
};

export const paperStyle = (lineCount, extra = {}) => ({
  width: `${PAPER_WIDTH}px`,
  boxSizing: "border-box",
  background: "#fafaf8",
  padding: `${20 + lineCount * 10}px 24px 8px`,
  minHeight: `${28 + lineCount * 4}vh`,
  fontFamily: "'Courier New', monospace",
  ...extra,
});