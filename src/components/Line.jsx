import { useState, useRef, useEffect } from "react";
import { editInputStyle } from "../constants";

export default function Line({ line, onEdit, onDelete }) {
  const [editText, setEditText] = useState(false);
  const [editVal,  setEditVal]  = useState(false);
  const [text, setText] = useState(line.text);
  const [val,  setVal]  = useState(line.value || "");
  const textRef = useRef();
  const valRef  = useRef();

  useEffect(() => { if (editText) textRef.current?.focus(); }, [editText]);
  useEffect(() => { if (editVal)  valRef.current?.focus();  }, [editVal]);
  useEffect(() => { setText(line.text); setVal(line.value || ""); }, [line]);

  const saveText = () => { setEditText(false); onEdit({ ...line, text }); };
  const saveVal  = () => { setEditVal(false);  onEdit({ ...line, value: val }); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, minHeight: 22 }}>
      {editText
        ? <input ref={textRef} value={text} onChange={e => setText(e.target.value)}
            onBlur={saveText} onKeyDown={e => e.key === "Enter" && saveText()}
            style={{ ...editInputStyle, flex: 1, borderBottom: "1px solid #aaa" }} />
        : <span onClick={() => setEditText(true)}
            style={{ flex: 1, cursor: "text", fontSize: 13, fontFamily: "'Courier New',monospace", lineHeight: 1.6, wordBreak: "break-word", padding: "1px 2px" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >{line.text || <span style={{ color: "#ccc" }}>&nbsp;</span>}</span>
      }
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, maxWidth: 90 }}>
        {editVal
          ? <input ref={valRef} value={val} onChange={e => setVal(e.target.value)}
              onBlur={saveVal}
              onKeyDown={e => {
                if (e.key === "Enter") saveVal();
                if (e.key === "Escape") { setEditVal(false); setVal(line.value || ""); }
              }}
              placeholder="Value"
              style={{ ...editInputStyle, width: 72, borderBottom: "1px solid #aaa", textAlign: "right" }} />
          : <span onClick={() => setEditVal(true)}
              style={{ fontSize: 12, fontFamily: "'Courier New',monospace", cursor: "text", padding: "1px 2px", textAlign: "right", color: line.value ? "#555" : "transparent", minWidth: line.value ? 16 : 48 }}
              onMouseEnter={e => { e.currentTarget.style.color = line.value ? "#333" : "#ddd"; e.currentTarget.style.background = "#f0f0ee"; }}
              onMouseLeave={e => { e.currentTarget.style.color = line.value ? "#555" : "transparent"; e.currentTarget.style.background = "transparent"; }}
            >{line.value || "+"}</span>
        }
      </div>
      <button onClick={onDelete}
        style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 12, padding: "0 2px", lineHeight: 1 }}
        onMouseEnter={e => e.currentTarget.style.color = "#e57373"}
        onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
      >×</button>
    </div>
  );
}