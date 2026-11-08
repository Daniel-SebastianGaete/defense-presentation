<script setup lang="ts">
// The Stage II walkthrough, drawn inside the architecture svg for the views that
// slide along it (`st1`, `st2`, `st3`): entity grouping, sentence segmentation and
// target marking in a row, each box with the text that goes into it and the text
// that comes out. `step` counts the reveals over the whole walkthrough, so that a
// slide that follows another starts where it left off:
//   1 the input of entity grouping (the layout merge output), 2 its output (the
//   markers merged: the input of sentence segmentation), 3 two of the merged
//   markers outlined, with the markers they stand for, and linked, 4 the output of
//   sentence segmentation, 5 each sentence given a colour, 6 the output of target
//   marking, 7 the input shrunk to one sentence, the last that has a marker, and the
//   output to what is made of it.
// Only the boxes are the figure's; the rest is an extra that fades around the zoom.
import { computed, ref } from 'vue'
import { BOXES, FOCUS_LOOK, STRIP, TARGET_LOOK, VIEWS, boxRect, textsOf } from './architecture-views'
import TextPanel from './TextPanel.vue'
import { FOCUS_SENTENCE, MERGED_MARKERS, PAGE_SENTENCES, PAGE_TEXT_GROUPED, PAGE_TEXT_MARKED, SENTENCE_COLORS, TARGET_COLORS, TARGET_INPUTS, TARGET_SENTENCES, flow } from './page-text'

const props = defineProps<{ view: string, step?: number, scale: number, arrowId: string }>()

const NAVY = '#000080'
const RED = '#e02020'
const FILL = '#ebebf5'
const reached = (n: number) => (props.step ?? 0) >= n

const S = STRIP
const width = (id: string) => BOXES[id][1] - BOXES[id][0]
const boxes = [
  { id: 'eg', dx: 0 },
  { id: 'ss', dx: S.ssDx },
  { id: 'tm', dx: S.tmDx },
]

const arrows = [
  { x1: S.inX + S.TW, x2: BOXES.eg[0], at: 1 },
  { x1: BOXES.eg[1], x2: S.aX, at: 2 },
  { x1: S.aX + S.TW, x2: S.ssX, at: 2 },
  { x1: S.ssX + width('ss'), x2: S.bX, at: 4 },
  { x1: S.bX + S.TW, x2: S.tmX, at: 4 },
  { x1: S.tmX + width('tm'), x2: S.cX, at: 6 },
]
// An arrow that the view cuts off would show as a stub, so only whole ones are drawn.
const inView = computed(() => {
  const [x, , w] = VIEWS[props.view].vb
  return arrows.filter(a => a.x1 >= x && a.x2 <= x + w)
})

// The size of the text and the room around each cell of the panels that do not take the default
// ones: [font, padding] in px. The target marking output is small enough to show all its inputs
// at once; once only one sentence (`FOCUS_SENTENCE`) is left, text and panels take the room that frees.
const look = (id: string) => ({
  c: reached(7) ? FOCUS_LOOK : TARGET_LOOK,
  b: reached(7) ? FOCUS_LOOK : undefined,
}[id])
const panels = [
  { id: 'in', x: S.inX, blocks: [flow(PAGE_TEXT_MARKED)], marks: true, at: 1 },
  { id: 'a', x: S.aX, blocks: [flow(PAGE_TEXT_GROUPED)], marks: true, at: 2 },
  { id: 'b', x: S.bX, blocks: PAGE_SENTENCES, colors: SENTENCE_COLORS, shown: (focus: boolean) => PAGE_SENTENCES.map((_, i) => !focus || i === FOCUS_SENTENCE), at: 4 },
  { id: 'c', x: S.cX, blocks: TARGET_INPUTS, colors: TARGET_COLORS, shown: (focus: boolean) => TARGET_SENTENCES.map(from => !focus || from === FOCUS_SENTENCE), at: 6 },
]

// Two of the markers that grouping merged, by their place among the markers of the
// output: the one of five markers in a row, and the one of two in a row two lines
// below it. Each, outlined, is linked to the markers of the input it stands for
// (also outlined), without crossing the text: the first link goes over the box
// and the second under it. A link leaves the top right corner of a source marker
// along the gap above its line (which is where the top edge of the outline is),
// goes up (or down) the channel between the input and the box, past the box,
// back along the channel between the box and the output, and reaches the top left
// corner of the merged marker along the gap above its line.
type Outline = { x: number, y: number, w: number, h: number }
const outlines = ref<Record<string, Outline[]>>({ in: [], a: [] })
const SHOWN = [7, 10]
const merged = computed(() => {
  const ins = outlines.value.in
  const outs = outlines.value.a
  let first = 0
  const found: { out: Outline, from: Outline[], k: number }[] = []
  MERGED_MARKERS.forEach((count, i) => {
    if (SHOWN.includes(i) && outs[i] && ins.length >= first + count)
      found.push({ out: outs[i], from: ins.slice(first, first + count), k: found.length })
    first += count
  })
  return found
})
const CLEARANCE = 5 // between the box and the link that goes past it
const OVER = -BOXES.eg[2] - CLEARANCE
const UNDER = -BOXES.eg[3] + CLEARANCE
const link = (m: { out: Outline, k: number }, from: Outline) => {
  const xl = S.inX + S.TW + (BOXES.eg[0] - (S.inX + S.TW)) / 2 // the middle of the channel before the box
  const xr = S.aX - (S.aX - BOXES.eg[1]) / 2 // and of the one after it
  const level = m.k === 0 ? OVER : UNDER
  return `${from.x + from.w},${from.y} ${xl},${from.y} ${xl},${level} ${xr},${level} ${xr},${m.out.y} ${m.out.x},${m.out.y}`
}
</script>

<template>
  <g>
    <g v-for="b in boxes" :key="b.id" :transform="`translate(${b.dx} 0)`">
      <rect v-bind="boxRect(BOXES[b.id])" rx="3" :fill="FILL" :stroke="NAVY" stroke-width="0.8" />
      <text v-for="(t, i) in textsOf(b.id)" :key="i" :x="t[0]" :y="-t[1]" class="box-text">{{ t[2] }}</text>
    </g>
    <g class="extra">
      <g v-for="(a, i) in inView" :key="`a${i}`" class="reveal" :class="{ on: reached(a.at) }">
        <polyline :points="`${a.x1},${S.mid} ${a.x2},${S.mid}`" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
      </g>
      <g v-for="p in panels" :key="p.id" class="reveal" :class="{ on: reached(p.at) }">
        <TextPanel
          :x="p.x" :cy="S.mid" :width="S.TW" :scale="scale" :blocks="p.blocks"
          :marks="p.marks" :font="look(p.id)?.[0]" :pad="look(p.id)?.[1]" :colors="p.colors" :colors-on="p.id === 'c' || reached(5)" :shown="p.shown?.(reached(7))" @outlines="outlines[p.id] = $event"
        />
      </g>
      <g class="reveal" :class="{ on: reached(3) && view === 'st1' }" fill="none" :stroke="RED" stroke-width="0.6">
        <template v-for="(m, i) in merged" :key="i">
          <rect :x="m.out.x" :y="m.out.y" :width="m.out.w" :height="m.out.h" />
          <rect v-for="(f, j) in m.from" :key="`f${j}`" :x="f.x" :y="f.y" :width="f.w" :height="f.h" />
          <polyline v-for="(f, j) in m.from" :key="j" :points="link(m, f)" stroke-width="0.4" />
        </template>
      </g>
    </g>
  </g>
</template>

<style scoped>
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
}
</style>
