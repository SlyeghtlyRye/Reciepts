import { useState } from "react";

const shortcuts = [
  ["Enter",      "new line"],
  ["Tab",        "jump to value field"],
  ["Backspace",  "pull last line back"],
  ["Click text", "edit any line or date"],
];

export default function Tips({ onDocs }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 36, textAlign: "center", position: "relative" }}>
      <div style={{
        position: "absolute", bottom: 0, left: -20, right: -20,
        background: "#2c2c2c",
        padding: "12px 8px 24px", lineHeight: 2, zIndex: 50, minHeight: 120,
        fontSize: 10, color: "#555", textAlign: "left",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.2s ease",
      }}>
        {shortcuts.map(([k, d]) => (
          <div key={k}>· <b style={{ color: "#666" }}>{k}</b> — {d}</div>
        ))}
        <div style={{ borderTop: "1px solid #333", marginTop: 4, paddingTop: 6 }}>
          <span
            onClick={onDocs}
            style={{ color: "#888", cursor: "pointer", fontSize: 10 }}
            onMouseEnter={e => e.currentTarget.style.color = "#ccc"}
            onMouseLeave={e => e.currentTarget.style.color = "#888"}
          >· Documentation</span>
        </div>
      </div>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: open ? "#aaa" : "#888", fontSize: 11,
        fontFamily: "'Courier New', monospace", padding: "2px 6px",
        lineHeight: 1, transition: "color 0.15s", position: "relative", zIndex: 51,
      }}>{open ? "↩" : "ⓘ"}</button>
    </div>
  );
}