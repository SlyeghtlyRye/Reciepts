import { useState, useRef, useEffect } from "react";
import { PRINTER_H, TORN_CLIP, PAPER_WIDTH, paperStyle } from "./constants";
import { now, animate, easeInOut, easeOut } from "./utils";
import Line from "./components/Line";
import TotalRow from "./components/TotalRow";
import { PrintedLine, PrintedTotal } from "./components/PrintedLine";
import Tips from "./components/Tips";
import PrintButton from "./components/PrintButton";
import ScrollOverlay from "./components/ScrollOverlay";
import Docs from "./components/Docs";

export default function App() {
  // ── Paper state ──────────────────────────────────────────────────────────
  const [lines,  setLines]  = useState([]);
  const [text,   setText]   = useState("");
  const [val,    setVal]    = useState("");
  const [header, setHeader] = useState("");
  const [date,   setDate]   = useState(now());
  const [editDate, setEditDate] = useState(false);

  // ── Total state (live paper) ──────────────────────────────────────────────
  const [showTotal,     setShowTotal]     = useState(false);
  const [totalOverride, setTotalOverride] = useState(null);
  const [totalLabel,    setTotalLabel]    = useState("TOTAL");

  // ── Receipt state (printed copy) ─────────────────────────────────────────
  const [receipt,        setReceipt]        = useState({ lines: [], header: "", date: "" });
  const [rShowTotal,     setRShowTotal]     = useState(false);
  const [rTotalOverride, setRTotalOverride] = useState(null);
  const [rTotalLabel,    setRTotalLabel]    = useState("TOTAL");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [phase,    setPhase]    = useState("writing"); // writing | ripping | ripped | feeding
  const [overlay,  setOverlay]  = useState(null);      // null | "paper" | "receipt"
  const [receiptY, setReceiptY] = useState(0);
  const [feedProg, setFeedProg] = useState(0);
  const [showDocs, setShowDocs] = useState(false);

  const inputRef = useRef();
  const valRef   = useRef();
  const dateRef  = useRef();
  const raf      = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { if (editDate) dateRef.current?.focus(); }, [editDate]);

  const paperIsTall   = lines.length >= 6;
  const receiptIsTall = receipt.lines.length >= 6;
  const writing  = phase === "writing";
  const ripped   = phase === "ripped";
  const feeding  = phase === "feeding";
  const ripping  = phase === "ripping";
  const showPaper   = writing || feeding;
  const showReceipt = ripping || ripped;

  // ── Line helpers ─────────────────────────────────────────────────────────
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

  // ── Keyboard handlers ────────────────────────────────────────────────────
  const onTextKey = e => {
    if (phase === "ripped") { if (e.key.length === 1) startNew(e.key); return; }
    if (phase !== "writing") return;
    if (e.key === "Enter")    { e.preventDefault(); commit(); }
    if (e.key === "Backspace" && text === "" && lines.length > 0) { e.preventDefault(); pullBack(); }
    if (e.key === "Tab")      { e.preventDefault(); valRef.current?.focus(); }
  };

  const onValKey = e => {
    if (e.key === "Enter")                     { e.preventDefault(); commit(); inputRef.current?.focus(); }
    if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); inputRef.current?.focus(); }
  };

  // ── Print / new entry ────────────────────────────────────────────────────
  const print = () => {
    if (phase === "ripped") { startNew(""); return; }
    if (phase !== "writing") return;
    const extra = text.trim() ? [{ text, value: val.trim() }] : [];
    const final = [...lines, ...extra];
    if (!final.length) return;

    setOverlay(null);
    setReceipt({ lines: final, header, date });
    setRShowTotal(showTotal); setRTotalOverride(totalOverride); setRTotalLabel(totalLabel);
    setLines([]); setText(""); setVal("");
    setReceiptY(0); setPhase("ripping");
    raf.current = animate(700, p => setReceiptY(Math.round(easeInOut(p) * 80)), () => setPhase("ripped"));
  };

  const startNew = (firstChar = "") => {
    cancelAnimationFrame(raf.current);
    setPhase("feeding"); setFeedProg(0);
    setHeader(""); setDate(now()); setOverlay(null);
    setShowTotal(false); setTotalOverride(null); setTotalLabel("TOTAL");
    if (firstChar) setText(firstChar);
    inputRef.current?.focus();
    raf.current = animate(550, p => setFeedProg(easeOut(p)), () => {
      setPhase("writing"); setReceiptY(0); setFeedProg(1);
    });
  };

  // ── Line update helpers ──────────────────────────────────────────────────
  const updateLine  = (i, v) => v === null
    ? setLines(ls => ls.filter((_, j) => j !== i))
    : setLines(ls => ls.map((x, j) => j === i ? v : x));

  const updateRLine = (i, v) => v === null
    ? setReceipt(r => ({ ...r, lines: r.lines.filter((_, j) => j !== i) }))
    : setReceipt(r => ({ ...r, lines: r.lines.map((x, j) => j === i ? v : x) }));

  return (
    <div style={{
      height: "100vh", background: "#1a1a1a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
      paddingBottom: "12vh", fontFamily: "'Courier New', monospace",
      boxSizing: "border-box", position: "relative", overflow: "hidden",
    }}>

      {/* ── Docs overlay ── */}
      {showDocs && <Docs onClose={() => setShowDocs(false)} />}

      {/* ── Scroll overlays ── */}
      {overlay === "paper" && (
        <ScrollOverlay header={header} date={date} lines={lines}
          showTotal={showTotal} totalOverride={totalOverride} totalLabel={totalLabel}
          onTotalOverride={setTotalOverride} onTotalLabelChange={setTotalLabel}
          onClose={() => setOverlay(null)} onUpdateLine={updateLine}
        />
      )}
      {overlay === "receipt" && (
        <ScrollOverlay header={receipt.header} date={receipt.date} lines={receipt.lines}
          showTotal={rShowTotal} totalOverride={rTotalOverride} totalLabel={rTotalLabel}
          onTotalOverride={setRTotalOverride} onTotalLabelChange={setRTotalLabel}
          onClose={() => setOverlay(null)} onUpdateLine={updateRLine}
          hideTotal={true}
        />
      )}

      {/* ── Printed receipt ── */}
      {showReceipt && (
        <div className="print-area" onClick={() => ripped && setOverlay("receipt")}
          style={{
            position: "absolute",
            bottom: `calc(12vh + ${PRINTER_H}px + ${receiptY}px)`,
            left: `calc(50% - ${PAPER_WIDTH / 2}px)`,
            zIndex: 30,
            pointerEvents: ripped ? "auto" : "none",
            cursor: ripped ? "pointer" : "default",
            clipPath: TORN_CLIP, borderRadius: "4px 4px 0 0", transform: "translateZ(0)",
            ...paperStyle(receipt.lines.length, { boxShadow: "0 6px 24px rgba(0,0,0,0.45)" }),
          }}>
          <div style={{ textAlign: "center", marginBottom: 12, borderBottom: "1px dashed #ccc", paddingBottom: 10 }}>
            {receipt.header && <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 2, marginBottom: 3 }}>{receipt.header}</div>}
            <div style={{ fontSize: 10, color: "#999" }}>{receipt.date}</div>
          </div>
          {receipt.lines.map((l, i) => <PrintedLine key={i} line={l} />)}
          {rShowTotal && receipt.lines.length > 0 && (
            <PrintedTotal lines={receipt.lines} override={rTotalOverride} label={rTotalLabel} />
          )}
          {receiptIsTall && (
            <div style={{ fontSize: 9, color: "#bbb", letterSpacing: 1, textAlign: "center", marginTop: 4 }}>↕ scroll</div>
          )}
        </div>
      )}

      {/* ── Main UI ── */}
      <div style={{ width: PAPER_WIDTH, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 20 }}>

        {/* Live paper */}
        <div onClick={() => paperIsTall && setOverlay("paper")}
          style={{
            width: `${PAPER_WIDTH}px`, boxSizing: "border-box",
            minHeight: `${28 + Math.min(lines.length, 1) * 6}vh`,
            maxHeight: feeding ? `${Math.round(feedProg * 46)}vh` : "none",
            overflow: "hidden", borderRadius: "4px 4px 0 0",
            background: showPaper ? "#fafaf8" : "transparent",
            boxShadow: showPaper ? "0 -4px 20px rgba(0,0,0,0.4)" : "none",
            padding: showPaper ? "20px 24px 8px" : "0",
            opacity: feeding ? Math.min(feedProg * 2, 1) : 1,
            fontFamily: "'Courier New', monospace",
            cursor: paperIsTall ? "pointer" : "default",
            position: "relative",
          }}>
          {showPaper && <>
            {paperIsTall && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                fontSize: 9, color: "#bbb", letterSpacing: 1, textAlign: "center",
                display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
                padding: "4px 0 6px", background: "#fafaf8",
              }}>
                <span>↕ scroll</span>
                <span onClick={e => { e.stopPropagation(); setLines([]); }}
                  style={{ cursor: "pointer", color: "#e57373" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >clear all</span>
              </div>
            )}

            {/* Header / date */}
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

            {/* Lines */}
            <div onClick={e => e.stopPropagation()}>
              {lines.length === 0
                ? <div style={{ color: "#ccc", fontSize: 12, textAlign: "center", padding: "8px 0" }}>start typing below...</div>
                : lines.map((l, i) => (
                    <Line key={i} line={l}
                      onEdit={v => updateLine(i, v)}
                      onDelete={() => updateLine(i, null)}
                    />
                  ))
              }
              {lines.length > 0 && (
                <div style={{ marginTop: 6, borderTop: "1px dashed #ccc", paddingTop: 6, paddingBottom: paperIsTall ? 32 : 0 }}>
                  {showTotal
                    ? <TotalRow lines={lines} override={totalOverride} onOverride={setTotalOverride}
                        label={totalLabel} onLabelChange={setTotalLabel}
                        onHide={() => setShowTotal(false)} />
                    : <button onClick={() => setShowTotal(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 11, padding: "0 2px", fontFamily: "'Courier New',monospace" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
                        onMouseLeave={e => e.currentTarget.style.color = "#888"}
                      >›</button>
                  }
                </div>
              )}
            </div>
          </>}
        </div>

        {/* Printer / input area */}
        <div style={{
          width: "100%", background: "#2c2c2c",
          borderRadius: "0 0 12px 12px", padding: "32px 20px 24px", boxSizing: "border-box",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)}
              onKeyDown={onTextKey} rows={1}
              placeholder={ripped ? "Start typing for a new entry..." : "Write something..."}
              disabled={ripping}
              style={{
                flex: 1, background: "transparent", border: "none", resize: "none", outline: "none",
                color: "#e0e0e0", fontFamily: "'Courier New',monospace", fontSize: 13,
                lineHeight: 1.6, caretColor: "#76ff03", boxSizing: "border-box", overflow: "hidden",
                opacity: ripping ? 0.25 : 1,
              }} />
            {writing && (
              <input ref={valRef} value={val} onChange={e => setVal(e.target.value)}
                onKeyDown={onValKey} placeholder="Value"
                style={{ width: 72, background: "transparent", border: "none", outline: "none", padding: "2px 0", flexShrink: 0, textAlign: "right", color: "#bbb", fontFamily: "'Courier New',monospace", fontSize: 12 }} />
            )}
          </div>
          <PrintButton phase={phase} ripping={ripping} feeding={feeding} onClick={print} />
          <Tips onDocs={() => setShowDocs(true)} />
          
        </div>
      </div>
    </div>
  );
}