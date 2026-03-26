import { useState } from "react";

export default function PrintButton({ phase, ripping, feeding, onClick }) {
  const [hovered, setHovered] = useState(false);
  const disabled = ripping || feeding;

  let bg, color;
  if (disabled)             { bg = "#2a2a2a"; color = "#444"; }
  else if (phase === "ripped")  { bg = hovered ? "#555" : "#444"; color = hovered ? "#ddd" : "#bbb"; }
  else if (phase === "writing") { bg = hovered ? "#aaff44" : "#76ff03"; color = "#111"; }
  else                      { bg = "#2a2a2a"; color = "#444"; }

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: 10, width: "100%", padding: "8px",
        border: "none", borderRadius: 4,
        fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: "bold", letterSpacing: 1,
        background: bg, color,
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.15s, color 0.15s",
      }}>
      {phase === "ripped" ? "NEW RECIEPT ↵" : "PRINT 🖶"}
    </button>
  );
}