import { useState } from "react";
import Line from "./Line";
import TotalRow from "./TotalRow";

export default function ScrollOverlay({
  header, date, lines,
  showTotal, totalOverride, totalLabel,
  onTotalOverride, onTotalLabelChange,
  onClose, onUpdateLine, hideTotal = false,
  onUpdateHeader, onUpdateDate, onToggleTotal,
}) {
  const [showTotalLocal, setShowTotalLocal] = useState(showTotal);

  const toggleTotal = val => {
    setShowTotalLocal(val);
    onToggleTotal?.(val);
  };
  const [editHeader, setEditHeader] = useState(false);
  const [editDate,   setEditDate]   = useState(false);
  const [headerVal,  setHeaderVal]  = useState(header);
  const [dateVal,    setDateVal]    = useState(date);

  const saveHeader = () => { setEditHeader(false); onUpdateHeader?.(headerVal); };
  const saveDate   = () => { setEditDate(false);   onUpdateDate?.(dateVal); };

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
          {editHeader
            ? <input value={headerVal} onChange={e => setHeaderVal(e.target.value)}
                onBlur={saveHeader} onKeyDown={e => e.key === "Enter" && saveHeader()}
                autoFocus
                style={{ textAlign: "center", fontWeight: "bold", letterSpacing: 2, fontSize: 15,
                  background: "#fffde7", border: "none", borderBottom: "1px solid #aaa",
                  outline: "none", width: "100%", fontFamily: "'Courier New',monospace", color: "#111" }} />
            : <div onClick={() => setEditHeader(true)}
                style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 2, marginBottom: 3,
                  cursor: "text", padding: "1px 2px", minHeight: 22 }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{headerVal || <span style={{ color: "#ccc" }}>Title</span>}</div>
          }
          {editDate
            ? <input value={dateVal} onChange={e => setDateVal(e.target.value)}
                onBlur={saveDate} onKeyDown={e => e.key === "Enter" && saveDate()}
                style={{ background: "#fffde7", border: "none", borderBottom: "1px solid #aaa",
                  outline: "none", fontSize: 10, fontFamily: "'Courier New',monospace",
                  color: "#777", textAlign: "center", width: "100%" }} />
            : <div onClick={() => setEditDate(true)}
                style={{ fontSize: 10, color: "#999", cursor: "text", padding: "1px 2px" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{dateVal}</div>
          }
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
                  onHide={hideTotal ? null : () => toggleTotal(false)}
                />
              : <button onClick={() => toggleTotal(true)}
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