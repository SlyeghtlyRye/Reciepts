import { useState, useRef, useEffect } from "react";
import { editInputStyle } from "../constants";
import { calcTotal, extractNum, fmtNum } from "../utils";

export default function TotalRow({ lines, override, onOverride, onHide, label, onLabelChange }) {
  const [editingVal,   setEditingVal]   = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [draft,      setDraft]      = useState("");
  const [labelDraft, setLabelDraft] = useState("");
  const valRef   = useRef();
  const labelRef = useRef();

  useEffect(() => { if (editingVal)   valRef.current?.focus();   }, [editingVal]);
  useEffect(() => { if (editingLabel) labelRef.current?.focus(); }, [editingLabel]);

  const auto    = calcTotal(lines);
  const display = override !== null ? override : fmtNum(auto);

  const saveVal = () => {
    setEditingVal(false);
    const n = extractNum(draft);
    if (draft.trim() === "" || (n !== null && n === auto)) onOverride(null);
    else onOverride(draft.trim());
  };

  const saveLabel = () => {
    setEditingLabel(false);
    onLabelChange(labelDraft.trim() || "TOTAL");
  };

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {editingLabel
          ? <input ref={labelRef} value={labelDraft} onChange={e => setLabelDraft(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={e => { if (e.key === "Enter") saveLabel(); if (e.key === "Escape") setEditingLabel(false); }}
              style={{ ...editInputStyle, width: 72, borderBottom: "1px solid #aaa", fontSize: 12, fontWeight: "bold", letterSpacing: 1 }} />
          : <span onClick={() => { setLabelDraft(label); setEditingLabel(true); }}
              style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 1, color: "#555", fontFamily: "'Courier New',monospace", cursor: "text", padding: "1px 2px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{label}</span>
        }
        <span style={{ flex: 1 }} />
        {editingVal
          ? <input ref={valRef} value={draft} onChange={e => setDraft(e.target.value)}
              onBlur={saveVal}
              onKeyDown={e => { if (e.key === "Enter") saveVal(); if (e.key === "Escape") setEditingVal(false); }}
              style={{ ...editInputStyle, width: 80, borderBottom: "1px solid #aaa", textAlign: "right", fontSize: 13, fontWeight: "bold" }} />
          : <span onClick={() => { setDraft(display); setEditingVal(true); }}
              style={{ fontSize: 13, fontWeight: "bold", fontFamily: "'Courier New',monospace", color: "#333", cursor: "text", padding: "1px 4px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{display}</span>
        }
      </div>
      {onHide && (
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <span onClick={onHide}
            style={{ fontSize: 9, color: "#aaa", letterSpacing: 1, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.color = "#e57373"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >no total</span>
        </div>
      )}
    </div>
  );
}