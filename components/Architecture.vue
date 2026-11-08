<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Box } from './architecture-views'
import { BOXES, BOX_TEXT, IO_GAP, IO_H, IO_MARGIN, IO_W, VIEWS, W, ioGeometry, textsOf } from './architecture-views'
import StageStrip from './StageStrip.vue'
import StageStrip3 from './StageStrip3.vue'
import { CLASS_COLORS, PAGE_TEXT, PAGE_TEXT_MARKED, flow } from './page-text'
// Redrawn copy of thesis Figure 4.1 (the detailed architecture of the pipeline,
// tesis/chapters/experimental_setup.tex). All coordinates are the TikZ ones in
// pt, with the origin at the old centre of the "PDF / page image" node and y
// pointing up; `Y` flips them into SVG space.
const NAVY = '#000080'
const FILL = '#ebebf5'

// The input page: a crop of the case file (1692 x 1335 px), 1.8 cm tall like in
// the pipeline diagram. `right` is its right edge; it grows to the left.
const INPUT = { h: 100, w: (100 * 1692) / 1335, right: 20 }

const boxes = Object.values(BOXES)

const stages: Box[] = [
  [90.54, 304.28, 65.97, -66.12], // Stage I
  [-28.78, 261.76, -105.84, -160.62], // Stage II
  [323.5, 506.07, -98.04, -168.42], // Stage III
]

const arrows: [number, number][][] = [
  [[INPUT.right, 0], [96.91, 45.42]],
  [[INPUT.right, 0], [96.91, 0]],
  [[INPUT.right, 0], [96.91, -45.5]],
  [[155.9, 45.42], [216.23, 0]],
  [[155.9, 0], [216.23, 0]],
  [[155.9, -45.5], [216.23, 0]],
  [[257.07, -8.81], [257.07, -83.46], [9.92, -83.46], [9.92, -117.87]],
  [[42.25, -133.23], [77.06, -133.23]],
  [[141.73, -133.23], [176.55, -133.23]],
  [[255.38, -133.23], [329.88, -133.23]],
  [[388.88, -133.23], [423.69, -133.23]],
  [[304.28, -0.08], [461.69, -0.08], [461.69, -104.42]],
]

// Italic annotations on the arrows.
const notes: [number, number, string][] = [
  [192, 44.5, 'layout regions'],
  [181.3, 6.4, 'text spans'],
  [192, -44.5, 'boxes + scores'],
  [66.8, -66.3, 'marked'], [66.8, -77.3, 'transcription'],
  [292.6, -114.6, 'marked'], [292.6, -125.6, 'sentence'],
  [391, 6.1, 'localised redactions'],
]

const stageTitles: [number, number, string][] = [
  [197.4, 75.4, 'Stage I — Page analysis'],
  [116.5, -170.1, 'Stage II — Entity assembly'],
  [414.8, -177.9, 'Stage III — Entity typing'],
]

// `view` picks what is shown (see architecture-views.ts): the whole figure, a
// stage, or one box. Everything outside the viewBox is clipped by the svg, and
// the labels that would be cut by its edge are left out.
const props = defineProps<{ view?: string, step?: number, ask?: string, answer?: string[], settled?: Record<string, string[]>, build?: boolean, frames?: string[] }>()
const reached = (n: number) => (props.step ?? 0) >= n
// With `build`, the whole figure draws itself one part at a time, each part fading in on a click: the
// input (step 1), then Stage I (2), Stage II (3) and Stage III (4) with their boxes, arrows and notes.
// `rv(n)` is the class of what shows up at step `n`. The levels follow the order of `BOXES`, `arrows`,
// `notes` and `stageTitles`; an arrow comes with the box it points to.
const rv = (n: number) => (props.build ? { reveal: true, on: reached(n) } : null)
const BOX_LEVEL = [2, 2, 2, 2, 3, 3, 3, 4, 4]
const ARROW_LEVEL = [2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4]
const NOTE_LEVEL = [2, 2, 2, 3, 3, 4, 4, 4]
const TEXT_LEVEL = new Map<[number, number, string], number>(
  Object.keys(BOXES).flatMap((id, i) => textsOf(id).map(t => [t, BOX_LEVEL[i]] as [[number, number, string], number])),
)
// The `ask` box is put in question at step 1: its text turns into a question mark and a red
// rectangle marks it. At step 2 the question mark turns into the `answer`, its lines of text, and
// at step 3 the rectangle goes.
const ASK_PAD = 2.5 // from the box to the rectangle
// `frames` lists boxes (by id) that get the same red rectangle, one more at each click: the i-th at step i + 1.
const framed = (b: Box) => ({ x: b[0] - ASK_PAD, y: Y(b[2]) - ASK_PAD, width: b[1] - b[0] + 2 * ASK_PAD, height: b[2] - b[3] + 2 * ASK_PAD })
const ANSWER_LINE = 11.5 // between the lines of the answer
const askOn = computed(() => !!props.ask && reached(1))
const answerOn = computed(() => !!props.answer && reached(2))
const askTexts = computed(() => new Set(props.ask ? textsOf(props.ask) : []))
const askBox = computed(() => (props.ask ? BOXES[props.ask] : undefined))
// The boxes that an earlier slide already answered (box id -> lines): they carry the answer, with
// no question mark and no rectangle.
const settledBoxes = computed(() => Object.entries(props.settled ?? {}).map(([id, lines]) => ({ id, lines, box: BOXES[id] })))
const settledTexts = computed(() => new Set(settledBoxes.value.flatMap(s => textsOf(s.id))))
const v = computed(() => VIEWS[props.view ?? 'full'])
const zoom = computed(() => v.value.depth > 0)
const viewBox = computed(() => v.value.vb.join(' '))
const onlyBox = computed(() => (v.value.only ? BOXES[v.value.only] : undefined))
// The Stage II walkthrough draws its own scene instead of the figure.
const strip = computed(() => !!v.value.strip)
const inOnlyBox = (t: [number, number, string]) => {
  const b = onlyBox.value
  return !!b && t[0] > b[0] && t[0] < b[1] && t[1] < b[2] && t[1] > b[3]
}
const shown = (t: [number, number, string]) => !onlyBox.value && !strip.value && (!v.value.has || v.value.has(t[0], t[1]))
const boxesShown = computed(() => (strip.value ? [] : onlyBox.value ? [onlyBox.value] : boxes))
const boxTexts = computed(() => (strip.value ? [] : onlyBox.value ? BOX_TEXT.filter(inOnlyBox) : BOX_TEXT))

// The OCR close-up also shows what goes in and what comes out, appearing one
// click at a time (`step`): the input page, then the OCR output, each with its
// arrow. Sizes are in architecture-views.ts.
const IO = { w: IO_W, h: IO_H, gap: IO_GAP }
const ioIn = { x: BOXES.ocr[0] - IO.gap - IO.w, arrow: [[BOXES.ocr[0] - IO.gap, 0], [BOXES.ocr[0], 0]] as [number, number][] }
const ioOut = { x: BOXES.ocr[1] + IO.gap, arrow: [[BOXES.ocr[1], 0], [BOXES.ocr[1] + IO.gap, 0]] as [number, number][] }
// The pages beside each close-up that has them: the input and the output.
// They are under the base the deck is served from (a repository site is served from `/<repository>/`).
const BASE = import.meta.env.BASE_URL
const IO_PAGES: Record<string, string> = { ld: `${BASE}figures/layout.png`, ocr: `${BASE}figures/ocr.png`, rd: `${BASE}figures/detection.png` }
const ioShown = computed(() => props.view !== 'ocrtext' && !!v.value.only && v.value.only in IO_PAGES)
const io = computed(() => {
  const id = v.value.only ?? 'ocr'
  const { w, h } = ioGeometry(id)
  const b = BOXES[id]
  const mid = (b[2] + b[3]) / 2 // figure coordinates, y up
  return {
    w,
    h,
    top: Y(mid) - h / 2,
    inX: b[0] - IO_GAP - w,
    outX: b[1] + IO_GAP,
    inArrow: [[b[0] - IO_GAP, mid], [b[0], mid]] as [number, number][],
    outArrow: [[b[1], mid], [b[1] + IO_GAP, mid]] as [number, number][],
    out: IO_PAGES[id],
  }
})
// The layout merge close-up shows what it merges: the outputs of the three
// submodules of Stage I, stacked to the left of the box (in the order of the
// stage) and each joined to the box by an arrow.
const MERGE_GAP = 45
const MERGE_PAGE_GAP = 4
const MERGE_FONT = 11 // px, as in `.ocr-text`
const merge = computed(() => {
  if (v.value.only !== 'lm')
    return []
  const [, vy, , vh] = v.value.vb
  const b = BOXES.lm
  const h = (vh - 2 * IO_MARGIN - 2 * MERGE_PAGE_GAP) / 3
  const w = (h * 1692) / 1335
  const x = b[0] - MERGE_GAP - w
  const boxMid = Y((b[2] + b[3]) / 2)
  return ['ld', 'ocr', 'rd'].map((id, i) => {
    const top = vy + IO_MARGIN + i * (h + MERGE_PAGE_GAP)
    return { src: IO_PAGES[id], x, top, w, h, arrow: `${x + w},${top + h / 2} ${b[0]},${boxMid}` }
  })
})
// Its output, the transcription with the redaction markers, in a box to the
// right that runs to the edge of the view, joined to the merge box by an arrow.
const mergeH = ref<number | null>(null) // height of the text, once measured
const mergeOut = computed(() => {
  if (v.value.only !== 'lm')
    return null
  const [vx, , vw] = v.value.vb
  const b = BOXES.lm
  const mid = Y((b[2] + b[3]) / 2)
  const x = b[1] + IO_GAP
  // As tall as the text once laid out (measured), centred on the arrow; until then a guess.
  const height = mergeH.value ?? 125
  return {
    arrow: [[b[1], -mid], [x, -mid]] as [number, number][],
    x,
    y: mid - height / 2,
    width: vx + vw - IO_MARGIN - x,
    height,
  }
})
// Every redaction marker of that text gets a red rectangle on the last click.
// Like the two phrases below, they are found by measuring the laid-out text.
const mergeParts = flow(PAGE_TEXT_MARKED).split('*****')
const mergeDiv = ref<HTMLElement | null>(null)
const marks: HTMLElement[] = []
const chunks: HTMLElement[] = []
const mergeMarks = ref<{ x: number, y: number, w: number, h: number }[]>([])
// The text between the markers, one rectangle per line it occupies, which the
// last click highlights in blue. They stop short of the red rectangles.
const mergeLines = ref<{ x: number, y: number, w: number, h: number }[]>([])
const BLUE = '#1f5fd0'
function measureMerge() {
  const d = mergeDiv.value
  if (!d || !d.offsetWidth)
    return
  mergeH.value = d.offsetHeight / (W / v.value.vb[2])
  const o = mergeOut.value
  if (!o)
    return
  const dr = d.getBoundingClientRect()
  const px = dr.width / d.offsetWidth
  const k = W / v.value.vb[2]
  // Side by side markers are one space (2.75 px) apart, so the sides get less room than the top and bottom.
  const padX = 1
  const padY = 1.5
  // Everything below is in the text's own px, relative to its top-left corner.
  const local = (r: DOMRect) => ({ l: (r.left - dr.left) / px, t: (r.top - dr.top) / px, r: (r.right - dr.left) / px, b: (r.bottom - dr.top) / px })
  const reds = marks.filter(Boolean).map(e => local(e.getClientRects()[0]))
  const fig = (r: { l: number, t: number, r: number, b: number }) => ({ x: o.x + r.l / k, y: o.y + r.t / k, w: (r.r - r.l) / k, h: (r.b - r.t) / k })
  mergeMarks.value = reds.map(r => fig({ l: r.l - padX, t: r.t - padY, r: r.r + padX, b: r.b + padY }))

  const lines = []
  for (const e of chunks) {
    const node = e?.firstChild
    const text = node?.textContent ?? ''
    const start = text.length - text.trimStart().length
    const end = text.trimEnd().length
    if (!node || end <= start)
      continue
    const range = document.createRange()
    range.setStart(node, start)
    range.setEnd(node, end)
    for (const c of range.getClientRects()) {
      if (c.width < 1)
        continue
      const r = local(c)
      // The rect the browser reports is the font's content area, which is taller
      // above the letters than below: its top is well clear of the ascenders while
      // its bottom is where the descenders end. So the top is pulled in and the
      // bottom pushed out, to leave the same margin around the ink.
      const box = { l: r.l - 1, t: r.t + 0.1 * MERGE_FONT, r: r.r + 1, b: r.b + 0.15 * MERGE_FONT }
      const mid = (r.l + r.r) / 2
      // Only the markers on this very line (the same content area) get in the way.
      for (const m of reds) {
        if (m.t >= r.b || m.b <= r.t || m.l - padX >= box.r || m.r + padX <= box.l)
          continue
        if ((m.l + m.r) / 2 < mid)
          box.l = Math.max(box.l, m.r + padX + 0.5)
        else
          box.r = Math.min(box.r, m.l - padX - 0.5)
      }
      if (box.r > box.l)
        lines.push(fig(box))
    }
  }
  mergeLines.value = lines
}
// The OCR close-up carries on after the pan: the output page is shown as well
// (it is the same output page as above), and next to it the same output as text.
const ocrPanShown = computed(() => props.view === 'ocrtext')
// After the pan the input is out of the picture and the OCR output is also
// shown as text, in a box to the right of the output page that runs to the edge
// of the view.
const textShown = computed(() => props.view === 'ocrtext')
const textArrow: [number, number][] = [[ioOut.x + IO.w, 0], [ioOut.x + IO.w + IO.gap, 0]]
const ocrH = ref<number | null>(null)
const textBox = computed(() => {
  const [x, , w, h] = v.value.vb
  const left = ioOut.x + IO.w + IO.gap
  // As tall as the text once laid out (measured), until then a guess.
  const height = ocrH.value ?? Math.min(h - 2 * IO_MARGIN, 108)
  return { x: left, y: -height / 2, width: x + w - IO_MARGIN - left, height }
})
// The text is laid out in px at 1x and scaled into the figure, so that Chrome's
// minimum font size does not apply.
const textScale = computed(() => W / v.value.vb[2])

// Two phrases of the page are traced from the output page to their place in the
// text: "que sanciona el" and "del Código de Justicia", which the output page
// shows on one line either side of a redaction. Boxes in the output page's own
// pixels, then in figure units.
const RED = '#e02020'
const PHRASES = ['que sanciona el', 'del Código de Justicia']
const imgSpans: [number, number, number, number][] = [[362, 308, 698, 352], [1100, 308, 1562, 352]]
const k = IO.w / 1692
const imgBoxes = imgSpans.map(([x1, y1, x2, y2]) => ({ x: ioOut.x + x1 * k, y: -IO.h / 2 + y1 * k, w: (x2 - x1) * k, h: (y2 - y1) * k }))
const iA = PAGE_TEXT.indexOf(PHRASES[0])
const iB = PAGE_TEXT.indexOf(PHRASES[1], iA + PHRASES[0].length)
const textParts = [
  PAGE_TEXT.slice(0, iA),
  PAGE_TEXT.slice(iA + PHRASES[0].length, iB),
  PAGE_TEXT.slice(iB + PHRASES[1].length),
]
const textDiv = ref<HTMLElement | null>(null)
const spanA = ref<HTMLElement | null>(null)
const spanB = ref<HTMLElement | null>(null)
const textBoxes = ref<{ x: number, y: number, w: number, h: number }[]>([])

// Where the two phrases ended up once the text is laid out, found by measuring
// them (the text wraps by itself). Screen pixels are turned into the text's own
// px by the ratio of the element's drawn and layout widths, which holds under
// any zoom, and from there into figure units.
function measure() {
  const d = textDiv.value
  if (!d || !d.offsetWidth)
    return
  const dr = d.getBoundingClientRect()
  const px = dr.width / d.offsetWidth
  ocrH.value = d.offsetHeight / textScale.value
  const out = []
  for (const e of [spanA.value, spanB.value]) {
    const r = e?.getClientRects()[0]
    if (!r)
      return
    const pad = 2
    out.push({
      x: textBox.value.x + ((r.left - dr.left) / px - pad) / textScale.value,
      y: textBox.value.y + ((r.top - dr.top) / px - pad) / textScale.value,
      w: (r.width / px + 2 * pad) / textScale.value,
      h: (r.height / px + 2 * pad) / textScale.value,
    })
  }
  textBoxes.value = out
}
let ro: ResizeObserver | undefined
onMounted(() => {
  const all = () => { measure(); measureMerge() }
  nextTick(all)
  document.fonts?.ready.then(all)
  setTimeout(all, 300)
  setTimeout(all, 1200)
})
let roMerge: ResizeObserver | undefined
watch(mergeDiv, (d) => {
  roMerge?.disconnect()
  if (d && typeof ResizeObserver !== 'undefined') {
    roMerge = new ResizeObserver(measureMerge)
    roMerge.observe(d)
  }
})
watch(textDiv, (d) => {
  ro?.disconnect()
  if (d && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    ro.observe(d)
  }
})
onBeforeUnmount(() => { ro?.disconnect(); roMerge?.disconnect() })
// Each link leaves the top of its box in the output page, runs over the top of
// the text box, and drops onto the top of its phrase, so that it stays clear of
// the text. The two run at different heights.
const links = computed(() =>
  textBoxes.value.length === 2
    ? imgBoxes.map((b, i) => {
        const t = textBoxes.value[i]
        const level = textBox.value.y - 4 - 4 * i
        return pts([[b.x + b.w / 2, -b.y], [b.x + b.w / 2, -level], [t.x + t.w / 2, -level], [t.x + t.w / 2, -t.y]])
      })
    : [],
)

// Each instance needs its own marker id: a `url(#id)` that resolves to a copy in
// a hidden slide draws no arrowheads.
const arrowId = `arch-arrow-${Math.random().toString(36).slice(2)}`

const Y = (y: number) => -y
const rect = (b: Box) => ({ x: b[0], y: Y(b[2]), width: b[1] - b[0], height: b[2] - b[3] })
const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${Y(y)}`).join(' ')
</script>

<template>
  <svg :viewBox="viewBox" class="architecture" :class="{ zoom }" :style="{ color: NAVY }">
    <defs>
      <marker :id="arrowId" viewBox="0 0 5 4" refX="5" refY="2" markerWidth="5" markerHeight="4" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0,0 L5,2 L0,4 L1.4,2 Z" :fill="NAVY" />
      </marker>
      <marker v-for="(color, name) in CLASS_COLORS" :id="`${arrowId}-${name}`" :key="name" viewBox="0 0 5 4" refX="5" refY="2" markerWidth="5" markerHeight="4" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0,0 L5,2 L0,4 L1.4,2 Z" :fill="color" />
      </marker>
    </defs>

    <rect
      v-for="(b, i) in onlyBox || strip ? [] : stages"
      :key="`s${i}`"
      :class="rv(i + 2)"
      v-bind="rect(b)"
      rx="4"
      fill="none"
      :stroke="NAVY"
      stroke-width="0.8"
      stroke-dasharray="3 3"
    />
    <polyline
      v-for="(a, i) in onlyBox || strip ? [] : arrows"
      :key="`a${i}`"
      :class="rv(ARROW_LEVEL[i])"
      :points="pts(a)"
      fill="none"
      :stroke="NAVY"
      stroke-width="0.8"
      :marker-end="`url(#${arrowId})`"
    />
    <image
      v-if="!zoom"
      :class="rv(1)"
      href="/figures/redacted_lawsuit_p53.png"
      :x="INPUT.right - INPUT.w"
      :y="-INPUT.h / 2"
      :width="INPUT.w"
      :height="INPUT.h"
    />
    <text v-if="!zoom" :x="INPUT.right - INPUT.w / 2" :y="INPUT.h / 2 + 10" class="note" :class="rv(1)">input</text>
    <rect
      v-for="(b, i) in boxesShown"
      :key="`b${i}`"
      :class="rv(BOX_LEVEL[i])"
      v-bind="rect(b)"
      rx="3"
      :fill="FILL"
      :stroke="NAVY"
      stroke-width="0.8"
    />

    <rect
      v-if="askBox"
      v-bind="framed(askBox)"
      rx="4"
      fill="none"
      :stroke="RED"
      stroke-width="1.3"
      class="reveal ask-rect"
      :class="{ on: askOn && !reached(3) }"
    />
    <rect
      v-for="(id, i) in frames ?? []"
      :key="`mk${id}`"
      v-bind="framed(BOXES[id])"
      rx="4"
      fill="none"
      :stroke="RED"
      stroke-width="1.3"
      class="reveal"
      :class="{ on: reached(i + 1) }"
    />

    <StageStrip v-if="v.strip === 2" :view="view!" :step="step" :scale="textScale" :arrow-id="arrowId" />
    <StageStrip3 v-if="v.strip === 3" :view="view!" :step="step" :scale="textScale" :arrow-id="arrowId" />

    <g v-if="ioShown || ocrPanShown" class="extra">
      <g v-if="ioShown" class="reveal" :class="{ on: reached(1) }">
        <polyline :points="pts(io.inArrow)" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <image href="/figures/redacted_lawsuit_p53.png" :x="io.inX" :y="io.top" :width="io.w" :height="io.h" />
        <rect :x="io.inX" :y="io.top" :width="io.w" :height="io.h" fill="none" :stroke="NAVY" stroke-width="0.25" />
      </g>
      <g class="reveal" :class="{ on: reached(2) || ocrPanShown }">
        <polyline :points="pts(io.outArrow)" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <image :href="io.out" :x="io.outX" :y="io.top" :width="io.w" :height="io.h" />
        <rect :x="io.outX" :y="io.top" :width="io.w" :height="io.h" fill="none" :stroke="NAVY" stroke-width="0.25" />
      </g>
    </g>

    <g v-if="merge.length" class="extra">
      <g v-for="(m, i) in merge" :key="`m${i}`" class="reveal" :class="{ on: reached(1) }">
        <polyline :points="m.arrow" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <image :href="m.src" :x="m.x" :y="m.top" :width="m.w" :height="m.h" />
        <rect :x="m.x" :y="m.top" :width="m.w" :height="m.h" fill="none" :stroke="NAVY" stroke-width="0.25" />
      </g>
    </g>

    <g v-if="mergeOut" class="extra reveal" :class="{ on: reached(2) }">
      <polyline :points="pts(mergeOut.arrow)" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
      <rect :x="mergeOut.x" :y="mergeOut.y" :width="mergeOut.width" :height="mergeOut.height" rx="3" :fill="FILL" :stroke="NAVY" stroke-width="0.8" />
      <foreignObject :x="mergeOut.x" :y="mergeOut.y" :width="mergeOut.width" :height="mergeOut.height">
        <div
          ref="mergeDiv"
          class="ocr-text"
          :style="{ width: `${mergeOut.width * textScale}px`, transform: `scale(${1 / textScale})` }"
        >
          <template v-for="(p, i) in mergeParts" :key="i"><span :ref="(e) => { chunks[i] = e as HTMLElement }">{{ p }}</span><span v-if="i < mergeParts.length - 1" :ref="(e) => { marks[i] = e as HTMLElement }">*****</span></template>
        </div>
      </foreignObject>
      <g class="reveal" :class="{ on: reached(4) }" fill="none" :stroke="BLUE" stroke-width="0.6">
        <rect v-for="(b, i) in mergeLines" :key="`b${i}`" :x="b.x" :y="b.y" :width="b.w" :height="b.h" />
      </g>
      <g class="reveal" :class="{ on: reached(3) && !reached(4) }" fill="none" :stroke="RED" stroke-width="0.6">
        <rect v-for="(b, i) in mergeMarks" :key="`r${i}`" :x="b.x" :y="b.y" :width="b.w" :height="b.h" />
      </g>
    </g>

    <g v-if="textShown" class="extra">
      <polyline :points="pts(textArrow)" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
      <rect v-bind="textBox" rx="3" :fill="FILL" :stroke="NAVY" stroke-width="0.8" />
      <foreignObject :x="textBox.x" :y="textBox.y" :width="textBox.width" :height="textBox.height">
        <div
          ref="textDiv"
          class="ocr-text"
          :style="{ width: `${textBox.width * textScale}px`, transform: `scale(${1 / textScale})` }"
        >
          {{ textParts[0] }}<span ref="spanA">{{ PHRASES[0] }}</span>{{ textParts[1] }}<span ref="spanB">{{ PHRASES[1] }}</span>{{ textParts[2] }}
        </div>
      </foreignObject>
      <g class="reveal" :class="{ on: reached(1) }" fill="none" :stroke="RED" stroke-width="0.6">
        <polyline v-for="(l, i) in links" :key="`l${i}`" :points="l" />
        <rect v-for="(b, i) in imgBoxes" :key="`i${i}`" :x="b.x" :y="b.y" :width="b.w" :height="b.h" />
        <rect v-for="(b, i) in textBoxes" :key="`x${i}`" :x="b.x" :y="b.y" :width="b.w" :height="b.h" />
      </g>
    </g>

    <text v-for="(t, i) in boxTexts" :key="`t${i}`" :x="t[0]" :y="Y(t[1])" class="box-text" :class="[{ fades: (askOn && askTexts.has(t)) || settledTexts.has(t) }, rv(TEXT_LEVEL.get(t) ?? 1)]">{{ t[2] }}</text>
    <template v-for="s in settledBoxes" :key="`set-${s.id}`">
      <text
        v-for="(line, i) in s.lines"
        :key="i"
        :x="(s.box[0] + s.box[1]) / 2"
        :y="Y((s.box[2] + s.box[3]) / 2) + (i - (s.lines.length - 1) / 2) * ANSWER_LINE"
        class="answer on"
      >{{ line }}</text>
    </template>
    <text v-if="askBox" :x="(askBox[0] + askBox[1]) / 2" :y="Y((askBox[2] + askBox[3]) / 2)" class="ask" :class="{ on: askOn && !answerOn }">?</text>
    <template v-if="askBox && answer">
      <text
        v-for="(line, i) in answer"
        :key="`ans${i}`"
        :x="(askBox[0] + askBox[1]) / 2"
        :y="Y((askBox[2] + askBox[3]) / 2) + (i - (answer.length - 1) / 2) * ANSWER_LINE"
        class="answer"
        :class="{ on: answerOn }"
      >{{ line }}</text>
    </template>
    <text v-for="(t, i) in notes.filter(shown)" :key="`n${i}`" :x="t[0]" :y="Y(t[1])" class="note" :class="rv(NOTE_LEVEL[notes.indexOf(t)])">{{ t[2] }}</text>
    <text v-for="(t, i) in stageTitles.filter(shown)" :key="`h${i}`" :x="t[0]" :y="Y(t[1])" class="stage" :class="rv(stageTitles.indexOf(t) + 2)">{{ t[2] }}</text>
  </svg>
</template>

<style scoped>
.architecture {
  display: block;
  margin: 0 auto;
  font-family: Tinos, 'Liberation Serif', 'Times New Roman', serif;
  overflow: visible;
}
.architecture.zoom {
  overflow: hidden;
}
.ocr-text {
  box-sizing: border-box;
  transform-origin: 0 0;
  padding: 8px 10px;
  overflow: hidden;
  color: #000;
  position: relative;
  font-size: 11px;
  line-height: 1.35;
  text-align: left;
}
.reveal {
  opacity: 0;
  transition: opacity 0.4s;
}
.reveal.on {
  opacity: 1;
}
text {
  text-anchor: middle;
  dominant-baseline: central;
}
.box-text {
  fill: #000;
  font-size: 10.95px;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.3s, transform 0.4s;
}
/* A box's text fades in with its box when the figure builds up. */
.box-text.reveal {
  transition: opacity 0.4s, transform 0.4s;
}
/* The text of the box in question shrinks away as its question mark grows in. */
.box-text.fades {
  opacity: 0;
  transform: scale(0.4);
}
/* The question mark and the answer take turns: each goes at once, and the other grows in after it. */
.ask,
.answer {
  fill: #000;
  opacity: 0;
  transform: scale(0.4);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.3s, transform 0.4s;
}
.ask {
  font-size: 26px;
}
.answer {
  font-size: 9.5px;
}
.ask.on,
.answer.on {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s 0.15s, transform 0.4s 0.15s;
}
.note {
  fill: currentColor;
  font-style: italic;
  font-size: 9px;
}
.stage {
  fill: currentColor;
  font-weight: bold;
  font-size: 10.95px;
}
</style>
