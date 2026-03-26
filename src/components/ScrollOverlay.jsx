import { useState } from "react";
import Line from "./Line";
import TotalRow from "./TotalRow";

export default function ScrollOverlay({
  header, date, lines,
  showTotal, totalOverride, totalLabel,
  onTotalOverride, onTotalLabelChange,
  onClose, onUpdateLine, hideTotal = false,
}) {
  const [showTotalLocal, setShowTotalLocal] = useState(showTotal);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fafaf8", width: 340, maxHeight: "80vh",
        borderRadius: 4, overflowY: "auto", padding: "20px 24px 24px",
        fontFamily: "'Courier New', monospace", boxSizing: "border-box",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)", scrollbarWidth: "none",
      }}>
        <div style={{ textAlign: "right", marginBottom: 8 }}>
          <span onClick={onClose} style={{ fontSize: 10, color: "#bbb", cursor: "pointer" }}>✕ close</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 12, borderBottom: "1px dashed #ccc", paddingBottom: 10 }}>
          {header && <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 2, marginBottom: 3 }}>{header}</div>}
          <div style={{ fontSize: 10, color: "#999" }}>{date}</div>
        </div>

        {lines.map((l, i) => (
          <Line key={i} line={l}
            onEdit={v => onUpdateLine(i, v)}
            onDelete={() => onUpdateLine(i, null)}
          />
        ))}

        {lines.length > 0 && (
          <div style={{ marginTop: 6, borderTop: "1px dashed #ccc", paddingTop: 6 }}>
            {showTotalLocal
              ? <TotalRow
                  lines={lines}
                  override={totalOverride}
                  onOverride={onTotalOverride}
                  label={totalLabel}
                  onLabelChange={onTotalLabelChange}
                  onHide={hideTotal ? null : () => setShowTotalLocal(false)}
                />
              : <button onClick={() => setShowTotalLocal(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 11, padding: "0 2px", fontFamily: "'Courier New',monospace" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
                  onMouseLeave={e => e.currentTarget.style.color = "#888"}
                >›</button>
            }
          </div>
        )}
      </div>
    </div>
  );
}