import { useState, useRef, useEffect } from "react";

const now = () => new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

const TORN_CLIP = `polygon(
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

const PRINTER_H = 148;

const paperStyle = (lineCount, extra = {}) => ({
  width: "300px", boxSizing: "border-box",
  background: "#fafaf8",
  padding: `${20 + lineCount * 10}px 24px 8px`,
  minHeight: `${28 + lineCount * 4}vh`,
  fontFamily: "'Courier New', monospace",
  ...extra,
});

const editInputStyle = {
  border: "none", background: "#fffde7",
  fontFamily: "'Courier New', monospace",
  fontSize: 13, outline: "none", padding: "1px 2px",
};

function Tips() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 16, textAlign: "center", position: "relative" }}>
      <div style={{
        position: "absolute", bottom: "calc(100% - 5px)", left: 0, right: 0,
        background: "#2c2c2c", padding: "8px 4px 8px", lineHeight: 2,
        fontSize: 10, color: "#555", textAlign: "left",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.2s ease",
      }}>
        {[
          ["Enter", "new line"],
          ["Tab", "jump to value field"],
          ["Backspace", "pull last line back"],
          ["Click text", "edit any line or date"],
        ].map(([k, d]) => (
          <div key={k}>· <b style={{ color: "#666" }}>{k}</b> — {d}</div>
        ))}
      </div>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: open ? "#aaa" : "#888", fontSize: 11,
        fontFamily: "'Courier New', monospace", padding: "2px 6px",
        lineHeight: 1, transition: "color 0.15s",
      }}>{open ? "↩" : "ⓘ"}</button>
    </div>
  );
}

function Line({ line, onEdit, onDelete }) {
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
        {(line.value || editVal) && <span style={{ color: "#ccc", fontSize: 11, letterSpacing: 1 }}>···</span>}
        {editVal
          ? <input ref={valRef} value={val} onChange={e => setVal(e.target.value)}
              onBlur={saveVal}
              onKeyDown={e => { if (e.key === "Enter") saveVal(); if (e.key === "Escape") { setEditVal(false); setVal(line.value || ""); } }}
              placeholder="Value"
              style={{ ...editInputStyle, width: 72, borderBottom: "1px solid #aaa", textAlign: "right" }} />
          : <span onClick={() => setEditVal(true)}
              style={{ fontSize: 12, fontFamily: "'Courier New',monospace", cursor: "text", padding: "1px 2px", textAlign: "right", color: line.value ? "#555" : "transparent", minWidth: line.value ? 16 : 48 }}
              onMouseEnter={e => { e.currentTarget.style.color = line.value ? "#333" : "#ddd"; e.currentTarget.style.background = "#f0f0ee"; }}
              onMouseLeave={e => { e.currentTarget.style.color = line.value ? "#555" : "transparent"; e.currentTarget.style.background = "transparent"; }}
            >{line.value || "+"}</span>
        }
      </div>
      <button onClick={onDelete} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 12, padding: "0 2px", lineHeight: 1 }}
        onMouseEnter={e => e.currentTarget.style.color = "#e57373"}
        onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
      >×</button>
    </div>
  );
}

function PrintedLine({ line }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", minHeight: 22, gap: 4 }}>
      <span style={{ flex: 1, fontSize: 13, lineHeight: 1.7, wordBreak: "break-word" }}>{line.text || <span>&nbsp;</span>}</span>
      {line.value && <>
        <span style={{ fontSize: 10, color: "#bbb", letterSpacing: 2 }}>···</span>
        <span style={{ fontSize: 12, fontFamily: "'Courier New',monospace", color: "#555", whiteSpace: "nowrap" }}>{line.value}</span>
      </>}
    </div>
  );
}

// Scrollable overlay — works for both live paper and printed receipt
function ScrollOverlay({ header, date, lines, isReceipt, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fafaf8", width: 300, maxHeight: "80vh",
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
        {lines.map((l, i) => <PrintedLine key={i} line={l} />)}
      </div>
    </div>
  );
}

export default function ThermalJournal() {
  const [lines,    setLines]    = useState([]);
  const [text,     setText]     = useState("");
  const [val,      setVal]      = useState("");
  const [header,   setHeader]   = useState("");
  const [date,     setDate]     = useState(now());
  const [editDate, setEditDate] = useState(false);
  const [phase,    setPhase]    = useState("writing");
  // null | "paper" | "receipt"
  const [overlay,  setOverlay]  = useState(null);

  const [receipt,     setReceipt]     = useState({ lines: [], header: "", date: "" });
  const [frozenCount, setFrozenCount] = useState(0);
  const [receiptY,    setReceiptY]    = useState(0);
  const [feedProg,    setFeedProg]    = useState(0);

  const inputRef = useRef();
  const valRef   = useRef();
  const dateRef  = useRef();
  const raf      = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { if (editDate) dateRef.current?.focus(); }, [editDate]);

  const paperIsTall   = lines.length >= 6;
  const receiptIsTall = receipt.lines.length >= 6;

  const commit = () => {
    if (!text.trim()) return;
    setLines(l => [...l, { text, value: val.trim() }]);
    setText(""); setVal("");
  };

  const pullBack = () => {
    const last = lines[lines.length - 1];
    setLines(l => l.slice(0, -1));
    setText(last.text); setVal(last.value || "");
  };

  const onTextKey = e => {
    if (phase === "ripped") { e.preventDefault(); startNew(e.key.length === 1 ? e.key : ""); return; }
    if (phase !== "writing") return;
    if (e.key === "Enter")    { e.preventDefault(); commit(); }
    if (e.key === "Backspace" && text === "" && lines.length > 0) { e.preventDefault(); pullBack(); }
    if (e.key === "Tab")      { e.preventDefault(); valRef.current?.focus(); }
  };

  const onValKey = e => {
    if (e.key === "Enter")                     { e.preventDefault(); commit(); inputRef.current?.focus(); }
    if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); inputRef.current?.focus(); }
  };

  const animate = (duration, onFrame, onDone) => {
    let start = null;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      onFrame(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else onDone();
    };
    raf.current = requestAnimationFrame(tick);
  };

  const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easeOut   = t => 1 - Math.pow(1 - t, 3);

  const print = () => {
    if (phase === "ripped") { startNew(""); return; }
    if (phase !== "writing") return;
    const extra = text.trim() ? [{ text, value: val.trim() }] : [];
    const final = [...lines, ...extra];
    if (!final.length) return;

    setOverlay(null);
    setFrozenCount(final.length);
    setReceipt({ lines: final, header, date });
    setLines([]); setText(""); setVal("");
    setReceiptY(0); setPhase("ripping");
    animate(700, p => setReceiptY(Math.round(easeInOut(p) * 200)), () => setPhase("ripped"));
  };

  const startNew = (firstChar = "") => {
    cancelAnimationFrame(raf.current);
    setPhase("feeding"); setFeedProg(0);
    setHeader(""); setDate(now()); setOverlay(null);
    animate(550, p => setFeedProg(easeOut(p)), () => {
      setPhase("writing"); setReceiptY(0); setFeedProg(1);
      if (firstChar) setText(firstChar);
      setTimeout(() => inputRef.current?.focus(), 30);
    });
  };

  const writing     = phase === "writing";
  const ripped      = phase === "ripped";
  const feeding     = phase === "feeding";
  const ripping     = phase === "ripping";
  const showPaper   = writing || feeding;
  const showReceipt = ripping || ripped;

  return (
    <div style={{
      height: "100vh", background: "#1a1a1a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
      paddingBottom: "12vh", fontFamily: "'Courier New', monospace",
      boxSizing: "border-box", position: "relative", overflow: "hidden",
    }}>

      {/* ── Scroll overlay ── */}
      {overlay === "paper" && (
        <ScrollOverlay header={header} date={date} lines={lines} onClose={() => setOverlay(null)} />
      )}
      {overlay === "receipt" && (
        <ScrollOverlay header={receipt.header} date={receipt.date} lines={receipt.lines} onClose={() => setOverlay(null)} />
      )}

      {/* ── Receipt ── */}
      {showReceipt && (
        <div
          onClick={() => ripped && setOverlay("receipt")}
          style={{
            position: "absolute",
            bottom: `calc(12vh + ${PRINTER_H}px + ${receiptY}px)`,
            left: "calc(50% - 150px)",
            zIndex: 30,
            pointerEvents: ripped ? "auto" : "none",
            cursor: ripped ? "pointer" : "default",
            clipPath: TORN_CLIP, transform: "translateZ(0)",
            ...paperStyle(receipt.lines.length, { boxShadow: "0 6px 24px rgba(0,0,0,0.45)" }),
          }}>
          <div style={{ textAlign: "center", marginBottom: 12, borderBottom: "1px dashed #ccc", paddingBottom: 10 }}>
            {receipt.header && <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 2, marginBottom: 3 }}>{receipt.header}</div>}
            <div style={{ fontSize: 10, color: "#999" }}>{receipt.date}</div>
          </div>
          {receipt.lines.map((l, i) => <PrintedLine key={i} line={l} />)}
          {receiptIsTall && (
            <div style={{ fontSize: 9, color: "#bbb", letterSpacing: 1, textAlign: "right", marginTop: 4 }}>↕ scroll</div>
          )}
        </div>
      )}

      {/* ── Printer stack ── */}
      <div style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 20 }}>

        {/* Paper */}
        <div
          onClick={() => paperIsTall && setOverlay("paper")}
          style={{
            width: "300px", boxSizing: "border-box",
            minHeight: `${28 + Math.min(lines.length, 1) * 6}vh`,
            maxHeight: feeding ? `${Math.round(feedProg * 46)}vh` : "none",
            overflow: "hidden", borderRadius: "4px 4px 0 0",
            background: showPaper ? "#fafaf8" : "transparent",
            boxShadow: showPaper ? "0 -4px 20px rgba(0,0,0,0.4)" : "none",
            padding: showPaper ? `20px 24px 8px` : "0",
            opacity: feeding ? Math.min(feedProg * 2, 1) : 1,
            fontFamily: "'Courier New', monospace",
            cursor: paperIsTall ? "pointer" : "default",
            position: "relative",
          }}>
          {showPaper && <>
            {paperIsTall && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: 9, color: "#bbb", letterSpacing: 1, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "4px 0 6px" }}>
                <span>↕ scroll</span>
                <span onClick={e => { e.stopPropagation(); setLines([]); }} style={{ cursor: "pointer", color: "#e57373" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >clear all</span>
              </div>
            )}
            <div style={{ textAlign: "center", marginBottom: 12, borderBottom: "1px dashed #ccc", paddingBottom: 10 }}>
              <input value={header} onChange={e => setHeader(e.target.value)} placeholder="Title"
                onClick={e => e.stopPropagation()}
                style={{ textAlign: "center", fontWeight: "bold", letterSpacing: 2, fontSize: 15, background: "transparent", border: "none", outline: "none", width: "100%", fontFamily: "'Courier New',monospace", color: "#111" }} />
              <div style={{ fontSize: 10, color: "#999", marginTop: 3 }}>
                {editDate
                  ? <input ref={dateRef} value={date} onChange={e => setDate(e.target.value)}
                      onBlur={() => setEditDate(false)} onKeyDown={e => e.key === "Enter" && setEditDate(false)}
                      onClick={e => e.stopPropagation()}
                      style={{ background: "#fffde7", border: "none", borderBottom: "1px solid #aaa", outline: "none", fontSize: 10, fontFamily: "'Courier New',monospace", color: "#777", textAlign: "center", width: "100%" }} />
                  : <span onClick={e => { e.stopPropagation(); setEditDate(true); }} style={{ cursor: "text" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0f0ee"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >{date}</span>
                }
              </div>
            </div>
            <div onClick={e => e.stopPropagation()}>
              {lines.length === 0
                ? <div style={{ color: "#ccc", fontSize: 12, textAlign: "center", padding: "8px 0" }}>start typing below...</div>
                : lines.map((l, i) => (
                    <Line key={i} line={l}
                      onEdit={v => setLines(ls => ls.map((x, j) => j === i ? v : x))}
                      onDelete={() => setLines(ls => ls.filter((_, j) => j !== i))}
                    />
                  ))
              }
            </div>
          </>}
        </div>

        {/* Printer body */}
        <div style={{
          width: "100%", background: "#2c2c2c",
          borderRadius: "0 0 12px 12px", padding: "14px 20px 32px", boxSizing: "border-box",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)}
              onKeyDown={onTextKey} rows={1}
              placeholder={writing ? "Write something..." : ripped ? "Start typing for a new entry..." : ""}
              disabled={ripping || feeding}
              style={{
                flex: 1, background: "transparent", border: "none", resize: "none", outline: "none",
                color: "#e0e0e0", fontFamily: "'Courier New',monospace", fontSize: 13,
                lineHeight: 1.6, caretColor: "#76ff03", boxSizing: "border-box",
                opacity: (ripping || feeding) ? 0.25 : 1,
              }} />
            {writing && (
              <input ref={valRef} value={val} onChange={e => setVal(e.target.value)}
                onKeyDown={onValKey} placeholder="Value"
                style={{ width: 72, background: "transparent", border: "none", outline: "none", padding: "2px 0", flexShrink: 0, textAlign: "right", color: "#bbb", fontFamily: "'Courier New',monospace", fontSize: 12 }} />
            )}
          </div>

          <button onClick={print} disabled={ripping || feeding}
            style={{
              marginTop: 10, width: "100%", padding: "8px", border: "none", borderRadius: 4,
              fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: "bold", letterSpacing: 1,
              background: ripped ? "#444" : writing ? "#76ff03" : "#2a2a2a",
              color:      ripped ? "#bbb" : writing ? "#111"    : "#444",
              cursor: (ripping || feeding) ? "default" : "pointer",
              transition: "background 0.3s, color 0.3s",
            }}>
            {ripped ? "NEW ENTRY ↵" : "PRINT ENTRY 🖨"}
          </button>

          <Tips />
        </div>
      </div>
    </div>
  );
}