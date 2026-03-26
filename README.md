# Reciepts

A thermal receipt  app built with React + Vite. Type entries, assign values, print a receipt, and tear it off.

---

## Project Structure

```
src/
├── App.jsx               # Root component, all state lives here
├── main.jsx              # React entry point
├── constants.js          # Shared style values, dimensions, clip path
├── utils.js              # Pure helper functions (math, animation, date)
└── components/
    ├── Line.jsx          # A single editable entry row (text + value + delete)
    ├── TotalRow.jsx      # Editable TOTAL row shown at bottom of entries
    ├── PrintedLine.jsx   # Read-only version of a line (used on printed receipt)
    ├── PrintedTotal.jsx  # Read-only version of the total (used on printed receipt)
    ├── ScrollOverlay.jsx # Full-screen modal for scrolling tall paper/receipts
    ├── PrintButton.jsx   # The PRINT / NEW RECEIPT button with hover states
    └── Tips.jsx          # Keyboard shortcut tooltip toggled by ⓘ button
```

---

## File Reference

### `App.jsx`
The brain of the app. Manages all state and orchestrates the print/feed/rip animation lifecycle.

**State groups:**
- **Paper state** — `lines`, `text`, `val`, `header`, `date` — the live entry being written
- **Total state** — `showTotal`, `totalOverride`, `totalLabel` — live paper total config
- **Receipt state** — `receipt`, `rShowTotal`, `rTotalOverride`, `rTotalLabel` — the printed copy
- **UI state** — `phase`, `overlay`, `receiptY`, `feedProg` — animation and overlay control

**Phases:** `writing → ripping → ripped → feeding → writing`

---

### `constants.js`
Single source of truth for shared values.

| Export | Description |
|---|---|
| `PRINTER_H` | Height of the printer block in px |
| `TORN_CLIP` | CSS `clip-path` polygon for the torn receipt edge |
| `PAPER_WIDTH` | Width of the paper/printer in px (340) |
| `editInputStyle` | Shared inline style object for edit input fields |
| `paperStyle(n, extra)` | Function returning paper div styles based on line count |

---

### `utils.js`
Pure functions with no UI or side effects.

| Export | Description |
|---|---|
| `now()` | Returns current date/time as a formatted string |
| `extractNum(str)` | Extracts and sums numbers from a string. Letters become alphabet positions (a=1, z=26). Leading `-` negates total |
| `calcTotal(lines)` | Sums `extractNum` across all line values. Returns `null` if no numeric values |
| `fmtNum(n)` | Formats a number for display. Integers show whole, floats show 2 decimal places. `null` returns `—` |
| `easeInOut(t)` | Quadratic ease-in-out curve for animations |
| `easeOut(t)` | Cubic ease-out curve for animations |
| `animate(duration, onFrame, onDone)` | rAF loop — calls `onFrame(progress 0–1)` each frame, `onDone` when complete. Returns rAF id for cancellation |

---

### `Line.jsx`
A single journal entry row. Click the text to edit it, click the value area to add/edit a value, click `×` to delete.

**Props:** `line` `{ text, value }`, `onEdit(updatedLine)`, `onDelete()`

---

### `TotalRow.jsx`
The live editable TOTAL row. Shown at the bottom of entries when toggled on. Click the label to rename it (defaults back to "TOTAL" if cleared). Click the value to override it manually. Click "no total" to hide it.

**Props:** `lines`, `override`, `onOverride`, `onHide`, `label`, `onLabelChange`

---

### `PrintedLine.jsx`
Read-only display of a single line on the printed receipt. Shows text on the left and value on the right if present.

**Props:** `line` `{ text, value }`

---

### `PrintedTotal.jsx`
Read-only display of the TOTAL row on the printed receipt.

**Props:** `lines`, `override`, `label`

---

### `ScrollOverlay.jsx`
A dark overlay modal that appears when you click a tall paper or receipt. Renders the full scrollable list of `Line` components and an optional `TotalRow`. Click outside or `✕ close` to dismiss.

**Props:** `header`, `date`, `lines`, `showTotal`, `totalOverride`, `totalLabel`, `onTotalOverride`, `onTotalLabelChange`, `onClose`, `onUpdateLine`

---

### `PrintButton.jsx`
The main action button at the bottom of the printer. Shows `PRINT 🖶` during writing and `NEW RECEIPT ↵` after printing. Brightens on hover, dims when disabled.

**Props:** `phase`, `ripping`, `feeding`, `onClick`

---

### `Tips.jsx`
The `ⓘ` button in the printer footer. Toggles a tooltip showing keyboard shortcuts above it.

**No props.**

---

## Key Interactions

| Action | Result |
|---|---|
| Type + Enter | Adds a new line |
| Tab | Jumps to the Value field |
| Backspace on empty input | Pulls last line back into input |
| Click any line text | Edit it inline |
| Click `›` below entries | Opens the Total row |
| Click "no total" | Hides the Total row |
| Click PRINT | Animates receipt out, starts new paper |
| Click printed receipt | Opens scroll overlay to edit it |
| Type on ripped state | Starts a new entry automatically |