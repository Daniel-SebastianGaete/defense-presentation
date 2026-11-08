// Geometry of Figure 4.1 and of the views the deck zooms between. Coordinates
// are the TikZ ones in pt (origin at the old centre of the input node, y up).

export type Box = [number, number, number, number] // x1, x2, top, bottom

export const BOXES: Record<string, Box> = {
  ld: [96.91, 155.9, 59.59, 31.26], // layout detector
  ocr: [96.91, 155.9, 7.78, -7.78], // OCR
  rd: [96.91, 155.9, -31.25, -59.74], // redaction detection
  lm: [216.23, 297.9, 8.81, -8.81], // layout merge
  eg: [-22.41, 42.25, -117.87, -148.59], // entity grouping
  ss: [77.06, 141.73, -112.51, -153.95], // sentence segmentation
  tm: [176.55, 255.38, -112.22, -154.24], // target marking
  cl: [329.88, 388.88, -112.51, -153.95], // entity-type classification
  pr: [423.69, 499.69, -104.42, -162.04], // per-redaction records
}

// Text on the boxes: [x, y, text]
export const BOX_TEXT: [number, number, string][] = [
  [126.4, 50.8, 'Layout'], [126.4, 37.9, 'detector'],
  [126.4, -1.1, 'OCR'],
  [126.4, -40.2, 'Redaction'], [126.4, -53.1, 'detection'],
  [257.1, 0.1, 'Layout merge'],
  [9.9, -126.8, 'Entity'], [9.9, -139.7, 'grouping'],
  [109.4, -121.4, 'Sentence'], [109.4, -134.4, 'segmen-'], [109.4, -147.3, 'tation'],
  [216, -133.23, 'Target marking'],
  [359.4, -121.4, 'Entity-type'], [359.4, -134.4, 'classi-'], [359.4, -147.3, 'fication'],
  [461.7, -113.3, 'Per-redaction'], [461.7, -126.3, 'records'],
  [461.7, -140.2, '+ annotated'], [461.7, -153.2, 'transcription'],
]

export interface View {
  /** Key in `VIEWS`. */
  name: string
  /** SVG viewBox: x, y, width, height (y already flipped). */
  vb: [number, number, number, number]
  /** Nesting level: the whole figure, a stage, or a single box. */
  depth: 0 | 1 | 2
  /** For a stage: which labels (by centre, in figure coordinates) belong to it. */
  has?: (x: number, y: number) => boolean
  /** For a box: the only thing drawn. */
  only?: string
  /** The walkthrough of Stage II (see `STRIP`) or III (see `STRIP3`), which draws its own scene. */
  strip?: 2 | 3
  /**
   * Where this view's drawing is shifted from the real figure, for the box it is
   * about: what zooming to or from a stage needs to land that box on its real place.
   */
  dx?: number
}

// The slide's figure area, in slide pixels.
export const W = 868
const H = 380
// How much of the figure area a box fills in its close-up.
const BOX_FILL = 0.2

/** A view framed on one box, which then fills about 45% of the figure area. */
function boxView(id: string): View {
  const [x1, x2, top, bottom] = BOXES[id]
  const s = Math.min((BOX_FILL * W) / (x2 - x1), (BOX_FILL * H) / (top - bottom))
  const cx = (x1 + x2) / 2
  const cy = -(top + bottom) / 2
  return { name: id, vb: [cx - W / 2 / s, cy - H / 2 / s, W / s, H / s], depth: 2, only: id }
}

// The OCR close-up: the input page and the output page flank the box, each IO_GAP
// from it and IO_MARGIN from the edge of the view.
export const IO_GAP = 8
export const IO_MARGIN = 3
const ocrView = boxView('ocr')
/** Size of the input and output pages beside a box: as wide as its close-up leaves free. */
export function ioGeometry(id: string) {
  const w = BOXES[id][0] - IO_GAP - (boxView(id).vb[0] + IO_MARGIN)
  return { w, h: (w * 1335) / 1692 } // the pages are 1692 x 1335 px
}
export const IO_W = ioGeometry('ocr').w
export const IO_H = ioGeometry('ocr').h
// The pan that follows it: the view slides right until the box is where the
// input page's left edge was, which pushes the input out of the picture.
const OCR_PAN = BOXES.ocr[0] - IO_MARGIN - ocrView.vb[0]

// The Stage II walkthrough: entity grouping, sentence segmentation and target
// marking in one row at one scale, each with what goes into it and what comes out
// of it, which the view slides along without zooming. A text panel is as wide as
// its neighbours leave room for (`TW`), `G` away from the boxes it joins. The
// first box is where it is in the figure; the others are moved to the right to
// make room, so they are drawn `ssDx` and `tmDx` away from where the figure has
// them. The row is that of the boxes.
export const STRIP = (() => {
  const s = W / boxView('tm').vb[2] // the scale at which the largest box fills BOX_FILL
  const vw = W / s
  const vh = H / s
  const TW = 178
  const G = 16
  const [eg, ss, tm] = [BOXES.eg, BOXES.ss, BOXES.tm]
  const mid = -(eg[2] + eg[3]) / 2 // the row, in svg coordinates
  const inX = eg[0] - G - TW
  const aX = eg[1] + G
  const ssX = aX + TW + G
  const bX = ssX + (ss[1] - ss[0]) + G
  const tmX = bX + TW + G
  const cX = tmX + (tm[1] - tm[0]) + G
  return { vw, vh, TW, G, mid, inX, aX, ssX, bX, tmX, cX, ssDx: ssX - ss[0], tmDx: tmX - tm[0] }
})()
/** The text of the target marking output when all its inputs are shown at once: [font, padding] in px. */
export const TARGET_LOOK = [7, 2]
/** The same, once only one sentence is left and the text can take the room that frees. */
export const FOCUS_LOOK = [10.5, 8]

// The Stage III walkthrough, laid out the same way: entity-type classification and per-redaction
// records in one row at one scale (that at which the records box, the largest, fills BOX_FILL), each
// with what goes into it and what comes out of it. The panel between the two boxes is both: the
// output of the classification and the input of the records. The classification box is where it is
// in the figure; the records box is moved to the right to make room, so it is drawn `prDx` away from
// where the figure has it. Panels are all `TW` wide, which is what the two views leave room for:
// the first has the input, the box and the shared panel, the second that panel, the box and the
// outputs.
export const STRIP3 = (() => {
  const [vw, vh] = boxView('pr').vb.slice(2)
  const TW = 272
  const G = 16
  const [cl, pr] = [BOXES.cl, BOXES.pr]
  const mid = -(cl[2] + cl[3]) / 2 // the row, in svg coordinates (the records box is on it too)
  const inX = cl[0] - G - TW
  const mX = cl[1] + G
  const prX = mX + TW + G
  const oX = prX + (pr[1] - pr[0]) + G
  return { vw, vh, TW, G, mid, inX, mX, prX, oX, prDx: prX - pr[0] }
})()
function stripView(name: string, x: number, strip: 2 | 3, dx = 0): View {
  const g = strip === 2 ? STRIP : STRIP3
  return { name, vb: [x, g.mid - g.vh / 2, g.vw, g.vh], depth: 2, strip, dx }
}

/** A box as an svg rect (y is flipped). */
export const boxRect = (b: Box) => ({ x: b[0], y: -b[2], width: b[1] - b[0], height: b[2] - b[3] })
/** The texts of the figure that are on a box. */
export const textsOf = (id: string) => {
  const b = BOXES[id]
  return BOX_TEXT.filter(t => t[0] > b[0] && t[0] < b[1] && t[1] < b[2] && t[1] > b[3])
}

export const VIEWS: Record<string, View> = {
  full: { name: 'full', vb: [-110, -92, 624, 282], depth: 0 },
  s1: { name: 's1', vb: [30, -90, 300, 160], depth: 1, has: (x, y) => y > -60 && x < 330 },
  s2: { name: 's2', vb: [-40, 88, 362, 94], depth: 1, has: (x, y) => y < -95 && x < 320 },
  s3: { name: 's3', vb: [270, 88, 245, 98], depth: 1, has: (x, y) => y < -95 && x > 270 },
  ...Object.fromEntries(Object.keys(BOXES).map(id => [id, boxView(id)])),
  // On entity grouping with its input and output; slid right until its output is
  // the input in view, with sentence segmentation; slid right again, with target marking.
  st1: stripView('st1', (BOXES.eg[0] + BOXES.eg[1]) / 2 - STRIP.vw / 2, 2),
  st2: stripView('st2', STRIP.aX - 12, 2),
  st3: stripView('st3', STRIP.bX - IO_MARGIN, 2, STRIP.tmDx),
  // The same for Stage III: on entity-type classification with its input and the panel after it;
  // slid right until that panel is the input in view, with the records and their outputs.
  st4: stripView('st4', (BOXES.cl[0] + BOXES.cl[1]) / 2 - STRIP3.vw / 2, 3),
  st5: stripView('st5', STRIP3.mX - IO_MARGIN, 3, STRIP3.prDx),
  ocrtext: { ...ocrView, name: 'ocrtext', vb: [ocrView.vb[0] + OCR_PAN, ocrView.vb[1], ocrView.vb[2], ocrView.vb[3]] },
}

/** Where the svg is drawn inside its W x H box: scale and the box height. */
function geometry(v: View) {
  const [x, y, w, h] = v.vb
  const boxH = Math.min(H, (W * h) / w)
  return { cx: x + w / 2, cy: y + h / 2, s: Math.min(W / w, boxH / h), boxH }
}

// Sub-pixel x/y corrections, in slide pixels, measured on the rendered slides
// for the zoom from a stage into each box.
const NUDGE: Record<string, [number, number]> = {
  ld: [0.5, 0], ocr: [0.5, 0], rd: [0.5, 0.5], lm: [0, 0],
  eg: [1, 0], ss: [0.5, 0], tm: [0.5, 0],
  cl: [0.5, -0.5], pr: [0.5, -1],
  st1: [0.27, 0], st2: [0, 0], st3: [0.5, 0],
  st4: [0.13, 0], st5: [0.38, 0],
}

/**
 * CSS transform that maps the figure drawn in view `a` onto where view `b`
 * draws the same things (both in the figure area's own coordinates, origin
 * top-left). The small x correction is the measured sub-pixel offset of the
 * rendered slides.
 */
export function zoomTransform(a: View, b: View): string {
  const A = geometry(a)
  const B = geometry(b)
  const cross = a.depth !== b.depth
  // A view of the Stage II walkthrough draws its box away from where the figure
  // has it; undo that when going to or from the figure.
  A.cx -= cross ? (a.dx ?? 0) : 0
  B.cx -= cross ? (b.dx ?? 0) : 0
  const k = B.s / A.s
  const [nx, ny] = a.depth < b.depth ? (NUDGE[b.only ?? b.name] ?? [0, 0]) : [0, 0]
  // Views of the same depth are drawn the same way, so the correction only
  // applies when zooming between levels.
  const tx = W / 2 - (W / 2) * k + (A.cx - B.cx) * B.s - (a.depth === b.depth ? 0 : 0.36 * k) + nx
  const ty = B.boxH / 2 + (A.cy - B.cy) * B.s - (A.boxH / 2) * k + ny
  return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})`
}
