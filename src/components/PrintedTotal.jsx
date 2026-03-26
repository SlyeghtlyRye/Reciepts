// PrintedLine.jsx
export function PrintedLine({ line }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", minHeight: 22, gap: 4 }}>
      <span style={{ flex: 1, fontSize: 13, lineHeight: 1.7, wordBreak: "break-word" }}>
        {line.text || <span>&nbsp;</span>}
      </span>
      {line.value && (
        <span style={{ fontSize: 12, fontFamily: "'Courier New',monospace", color: "#555", whiteSpace: "nowrap" }}>
          {line.value}
        </span>
      )}
    </div>
  );
}

// PrintedTotal.jsx
import { calcTotal, fmtNum } from "../utils";

export function PrintedTotal({ lines, override, label }) {
  const display = override !== null ? override : fmtNum(calcTotal(lines));
  return (
    <div style={{ marginTop: 6, display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 1, color: "#555", fontFamily: "'Courier New',monospace" }}>
        {label}
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 13, fontWeight: "bold", fontFamily: "'Courier New',monospace", color: "#333" }}>
        {display}
      </span>
    </div>
  );
}