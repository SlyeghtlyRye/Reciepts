import { useState } from "react";

const FONT = "'Courier New', monospace";

const files = [
  {
    name: "App.jsx",
    tag: "root",
    desc: "Root component. All state lives here — paper, receipt, total, and animation phase.",
    details: [
      "Phases: writing → ripping → ripped → feeding → writing",
      "Paper state: lines, text, val, header, date",
      "Total state: showTotal, totalOverride, totalLabel",
      "Receipt state: receipt, rShowTotal, rTotalOverride, rTotalLabel",
      "UI state: phase, overlay, receiptY, feedProg",
    ],
  },
  {
    name: "constants.js",
    tag: "config",
    desc: "Single source of truth for shared values used across components.",
    details: [
      "PRINTER_H — height of the printer block in px",
      "TORN_CLIP — CSS clip-path polygon for the torn receipt edge",
      "PAPER_WIDTH — paper/printer width in px (340)",
      "editInputStyle — shared style object for inline edit inputs",
      "paperStyle(n, extra) — returns paper div styles based on line count",
    ],
  },
  {
    name: "utils.js",
    tag: "helpers",
    desc: "Pure helper functions with no UI or side effects.",
    details: [
      "now() — returns current date/time as a formatted string",
      "extractNum(str) — sums numbers from a string; letters become alphabet positions (a=1, z=26); leading - negates",
      "calcTotal(lines) — sums extractNum across all line values, returns null if none",
      "fmtNum(n) — formats number for display; null returns —",
      "easeInOut(t) — quadratic ease-in-out curve",
      "easeOut(t) — cubic ease-out curve",
      "animate(duration, onFrame, onDone) — rAF loop, returns id for cancellation",
    ],
  },
  {
    name: "Line.jsx",
    tag: "component",
    desc: "A single editable entry row. Click text to edit, click value area to add/edit, × to delete.",
    details: ["Props: line { text, value }, onEdit(updatedLine), onDelete()"],
  },
  {
    name: "TotalRow.jsx",
    tag: "component",
    desc: "Live editable TOTAL row at the bottom of entries. Label and value are both clickable to edit.",
    details: [
      "Click label to rename (falls back to TOTAL if cleared)",
      "Click value to manually override the auto-sum",
      "Click 'no total' to hide",
      "Props: lines, override, onOverride, onHide, label, onLabelChange",
    ],
  },
  {
    name: "PrintedLine.jsx",
    tag: "component",
    desc: "Read-only line display on the printed receipt.",
    details: ["Props: line { text, value }"],
  },
  {
    name: "PrintedTotal.jsx",
    tag: "component",
    desc: "Read-only TOTAL row on the printed receipt.",
    details: ["Props: lines, override, label"],
  },
  {
    name: "ScrollOverlay.jsx",
    tag: "component",
    desc: "Full-screen modal for scrolling tall papers/receipts. Renders editable lines and optional total.",
    details: [
      "Click outside or ✕ close to dismiss",
      "Props: header, date, lines, showTotal, totalOverride, totalLabel, onTotalOverride, onTotalLabelChange, onClose, onUpdateLine",
    ],
  },
  {
    name: "PrintButton.jsx",
    tag: "component",
    desc: "Main action button. Shows PRINT during writing, NEW RECEIPT after printing.",
    details: [
      "Brightens on hover, dims when disabled",
      "Props: phase, ripping, feeding, onClick",
    ],
  },
  {
    name: "Tips.jsx",
    tag: "component",
    desc: "The ⓘ button in the printer footer. Toggles a keyboard shortcut tooltip.",
    details: ["No props"],
  },
  {
    name: "Docs.jsx",
    tag: "component",
    desc: "This documentation page. Opened via the ? button in the printer footer.",
    details: ["Props: onClose()"],
  },
];

const shortcuts = [
  ["Enter",             "Add a new line"],
  ["Tab",               "Jump to the Value field"],
  ["Backspace",         "Pull last line back into input"],
  ["Click line text",   "Edit it inline"],
  ["Click › below entries", "Open the Total row"],
  ["Click 'no total'",  "Hide the Total row"],
  ["Click PRINT",       "Animate receipt out, start new paper"],
  ["Click receipt",     "Open scroll overlay to edit it"],
  ["Type while ripped", "Starts a new entry automatically"],
];

const tagColor = t => ({
  root:      { bg: "#1a2a1a", color: "#76ff03" },
  config:    { bg: "#1a1a2a", color: "#64b5f6" },
  helpers:   { bg: "#2a1a2a", color: "#ce93d8" },
  component: { bg: "#2a1a1a", color: "#ffb74d" },
}[t] || {});

const phases = [
  ["writing",  "#76ff03", "typing entries on live paper"],
  ["ripping",  "#ffb74d", "receipt animates upward"],
  ["ripped",   "#64b5f6", "receipt shown, ready for new"],
  ["feeding",  "#ce93d8", "new paper feeds in"],
];

export default function Docs({ onClose }) {
  const [expanded, setExpanded] = useState(null);
  const toggle = name => setExpanded(e => e === name ? null : name);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#111", color: "#fff",
      fontFamily: FONT, overflowY: "auto",
      padding: "40px 24px 60px", boxSizing: "border-box",
      fontSize: 13, fontWeight: "bold",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#76ff03", letterSpacing: 3 }}>Reciepts</div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 4, letterSpacing: 2 }}>DOCUMENTATION · v0.1</div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #333", color: "#666",
            fontFamily: FONT, fontSize: 11, padding: "6px 14px",
            cursor: "pointer", letterSpacing: 1,
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#ccc"}
            onMouseLeave={e => e.currentTarget.style.color = "#666"}
          >✕ close</button>
        </div>

        {/* Phase diagram */}
        <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 2, marginBottom: 12 }}>APP LIFECYCLE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
          {phases.map(([label, color, desc], i) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ background: "#1a1a1a", border: `1px solid ${color}`, color, fontSize: 10, padding: "6px 10px", letterSpacing: 1, whiteSpace: "nowrap" }}>{label}</div>
                <div style={{ fontSize: 9, color: "#aaa", marginTop: 4, maxWidth: 90, lineHeight: 1.4 }}>{desc}</div>
              </div>
              {i < phases.length - 1 && <div style={{ color: "#aaa", fontSize: 14, margin: "0 4px", marginBottom: 18 }}>→</div>}
            </div>
          ))}
          <div style={{ color: "#aaa", fontSize: 14, margin: "0 4px", marginBottom: 18 }}>→</div>
          <div style={{ fontSize: 9, color: "#aaa", marginBottom: 18 }}>writing</div>
        </div>

        {/* File tree */}
        <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 2, marginBottom: 12 }}>FILE TREE</div>
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", padding: "16px 20px", marginBottom: 32, fontSize: 11, lineHeight: 2, color: "#aaa" }}>
          <div style={{ color: "#76ff03" }}>src/</div>
          {["App.jsx", "main.jsx", "constants.js", "utils.js"].map(f => (
            <div key={f} style={{ paddingLeft: 16 }}>├── <span style={{ color: f === "App.jsx" ? "#76ff03" : f.endsWith(".js") ? "#ce93d8" : "#888" }}>{f}</span></div>
          ))}
          <div style={{ paddingLeft: 16, color: "#ffb74d" }}>└── components/</div>
          {["Line.jsx","TotalRow.jsx","PrintedLine.jsx","PrintedTotal.jsx","ScrollOverlay.jsx","PrintButton.jsx","Tips.jsx","Docs.jsx"].map((f, i, arr) => (
            <div key={f} style={{ paddingLeft: 36 }}>{i === arr.length - 1 ? "└──" : "├──"} <span style={{ color: "#ffb74d" }}>{f}</span></div>
          ))}
        </div>

        {/* Files */}
        <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 2, marginBottom: 12 }}>FILES</div>
        <div style={{ borderTop: "1px dashed #1e1e1e" }}>
          {files.map(f => {
            const tc = tagColor(f.tag);
            const open = expanded === f.name;
            return (
              <div key={f.name} style={{ borderBottom: "1px dashed #1e1e1e" }}>
                <div onClick={() => toggle(f.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", cursor: "pointer" }}>
                  <span style={{ fontSize: 9, padding: "2px 6px", background: tc.bg, color: tc.color, letterSpacing: 1, flexShrink: 0 }}>{f.tag}</span>
                  <span style={{ color: tc.color, fontSize: 13, fontWeight: "bold", flex: 1 }}>{f.name}</span>
                  <span style={{ color: "#333", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
                </div>
                {open && (
                  <div style={{ paddingBottom: 14, paddingLeft: 4 }}>
                    <div style={{ fontSize: 12, color: "#ccc", marginBottom: 10, lineHeight: 1.7 }}>{f.desc}</div>
                    {f.details.map((d, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#bbb", lineHeight: 1.9, paddingLeft: 8 }}>· {d}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Shortcuts */}
        <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 2, margin: "32px 0 12px" }}>INTERACTIONS</div>
        <div style={{ borderTop: "1px dashed #1e1e1e" }}>
          {shortcuts.map(([k, d]) => (
            <div key={k} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px dashed #161616" }}>
              <span style={{ color: "#76ff03", fontSize: 11, minWidth: 200, flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 11, color: "#bbb" }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, fontSize: 9, color: "#222", textAlign: "center", letterSpacing: 2 }}>
          Reciepts · BUILT WITH REACT + VITE
        </div>
      </div>
    </div>
  );
}