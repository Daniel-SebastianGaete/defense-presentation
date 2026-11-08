<script setup lang="ts">
// The Stage III walkthrough, drawn inside the architecture svg for the views that slide along it
// (`st4`, `st5`), as the one of Stage II (see StageStrip.vue): entity-type classification and
// per-redaction records in a row, each box with the text that goes into it and the text that comes
// out. `step` counts the reveals over the whole walkthrough, so that a slide that follows another
// starts where it left off:
//   1 the input of the classification (the target marking output of the first sentence), 2 its
//   output: that sentence, still with its markers, 3 each marker outlined in the colour of its
//   class, which is written outside the panel with an arrow of the same colour, 4 the outlines go
//   and every marker turns into its class, 5 the other sentences are added to the panel, which is
//   what the records take in, 6 what comes out of the records: the whole transcription, 7 and the
//   beginning of the records, 8 the two turn into the image of the output (the page with each
//   redaction boxed in the colour of its class).
// Only the boxes are the figure's; the rest is an extra that fades around the zoom.
import { computed, ref, watch } from 'vue'
import { BOXES, FOCUS_LOOK, STRIP3, VIEWS, boxRect, textsOf } from './architecture-views'
import TextPanel from './TextPanel.vue'
import { CLASS_COLORS, FOCUSED_CLASSES, FOCUSED_INPUTS, FOCUS_SENTENCE, FULL_CLASSES, PAGE_CLASSES, PAGE_SENTENCES, PAGE_TEXT_FULL, RECORDS_CLASSES, RECORDS_TEXT, asWords, flow } from './page-text'

const props = defineProps<{ view: string, step?: number, scale: number, arrowId: string }>()

const NAVY = '#000080'
const FILL = '#ebebf5'
const reached = (n: number) => (props.step ?? 0) >= n

const S = STRIP3
const boxes = [
  { id: 'cl', dx: 0 },
  { id: 'pr', dx: S.prDx },
]
const prRight = S.prX + (BOXES.pr[1] - BOXES.pr[0])

const arrows = [
  { x1: S.inX + S.TW, x2: BOXES.cl[0], at: 1 },
  { x1: BOXES.cl[1], x2: S.mX, at: 2 },
  { x1: S.mX + S.TW, x2: S.prX, at: 2 },
]
// An arrow that the view cuts off would show as a stub, so only whole ones are drawn.
const inView = computed(() => {
  const [x, , w] = VIEWS[props.view].vb
  return arrows.filter(a => a.x1 >= x && a.x2 <= x + w)
})

// The shared panel is one cell per sentence, of which only the first is there until the last click
// but one. The sentence takes two lines at this size, so every marker is on the top line or the
// bottom one: the class of a marker is written above the panel or below it, and its arrow reaches
// the marker from there without crossing any text.
const MID_FONT = 9 // px
const CLASS_GAP = 15 // from the panel to the middle of a class name
const midReveal = computed(() => PAGE_SENTENCES.map((_, i) => reached(5) || i === FOCUS_SENTENCE))
const midWords = asWords(PAGE_CLASSES)

type Rect = { x: number, y: number, w: number, h: number }
const classMarks = ref<Rect[]>([])
const classBox = ref({ y: 0, h: 0 })
// The annotations fade out where they were, however the text moves under them meanwhile, so they
// stop following it once it turns into the classes. Coming back they wait for the text to settle.
const onClassMarks = (m: Rect[]) => { if (!reached(4)) classMarks.value = m }
const onClassBox = (b: { y: number, h: number }) => { if (!reached(4)) classBox.value = b }
const classSettling = ref(false)
let classTimer: ReturnType<typeof setTimeout> | undefined
watch(() => reached(4), (now, was) => {
  clearTimeout(classTimer)
  classSettling.value = was && !now
  if (was && !now)
    classTimer = setTimeout(() => { classSettling.value = false }, 1300)
})
const classLinks = computed(() => {
  const { y, h } = classBox.value
  if (classMarks.value.length !== FOCUSED_CLASSES.length)
    return []
  return classMarks.value.map((m, i) => {
    const name = FOCUSED_CLASSES[i]
    const above = m.y + m.h / 2 < y + h / 2
    const x = m.x + m.w / 2
    const labelY = above ? y - CLASS_GAP : y + h + CLASS_GAP
    return { name, color: CLASS_COLORS[name], m, x, labelY, arrow: `${x},${labelY + (above ? 6 : -6)} ${x},${above ? m.y : m.y + m.h}` }
  })
})

// What comes out of the records, to the right: the whole transcription (the ground truth's, from the
// first line of the page to the last) with each marker replaced by its class, and under it the
// beginning of the per-redaction records. The box's arrow forks to the two, which are stacked on its
// row, as tall as their text (measured, see `box`), and show one after the other, each where it will
// stay.
const OUT_GAP = 8
const RECORDS_FONT = 7.5 // px
const transcriptionBlocks = [flow(PAGE_TEXT_FULL)]
const transcriptionWords = asWords(FULL_CLASSES)
const recordsBlocks = [RECORDS_TEXT]
const recordsWords = asWords(RECORDS_CLASSES)
const outBoxes = ref({ transcription: { y: 0, h: 0 }, records: { y: 0, h: 0 } })
const out = computed(() => {
  const { transcription, records } = outBoxes.value
  const top = S.mid - (transcription.h + OUT_GAP + records.h) / 2
  const cy = { transcription: top + transcription.h / 2, records: top + transcription.h + OUT_GAP + records.h / 2 }
  const fork = prRight + S.G / 2
  const arrow = (to: number) => `${prRight},${S.mid} ${fork},${S.mid} ${fork},${to} ${S.oX},${to}`
  return { cy, arrows: { transcription: arrow(cy.transcription), records: arrow(cy.records) } }
})
// The last click turns the two into the image of the output, which is as wide as they are and
// centred on the row like the two together: they are squashed to the height of the image, and fade
// out as it fades in, with a single arrow from the box.
const IMAGE_HEIGHT = (S.TW * 1335) / 1692 // the image is 1692 x 1335 px
const squash = computed(() => {
  const { transcription, records } = outBoxes.value
  const stack = transcription.h + OUT_GAP + records.h
  const done = reached(8)
  return {
    transform: done && stack > 0 ? `translateY(${S.mid}px) scaleY(${IMAGE_HEIGHT / stack}) translateY(${-S.mid}px)` : 'none',
    transformOrigin: '0 0',
    transition: done ? 'opacity 0.35s linear 0.15s, transform 0.5s ease' : 'opacity 0.4s linear, transform 0.5s ease',
  }
})
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
      <g class="reveal" :class="{ on: reached(1) }">
        <TextPanel
          :x="S.inX" :cy="S.mid" :width="S.TW" :scale="scale" :blocks="FOCUSED_INPUTS"
          :font="FOCUS_LOOK[0]" :pad="FOCUS_LOOK[1]"
        />
      </g>
      <g class="reveal" :class="{ on: reached(2) }">
        <TextPanel
          :x="S.mX" :cy="S.mid" :width="S.TW" :scale="scale" :blocks="PAGE_SENTENCES" marks
          :reveal="midReveal" :swap="midWords" :swapped="reached(4)" :font="MID_FONT" :pad="FOCUS_LOOK[1]"
          @outlines="onClassMarks" @box="onClassBox"
        />
      </g>
      <g class="reveal" :class="{ on: reached(3) && !reached(4) }" :style="{ transitionDelay: classSettling ? '0.6s' : '0s' }" fill="none" stroke-width="0.6">
        <template v-for="(l, i) in classLinks" :key="i">
          <rect :x="l.m.x" :y="l.m.y" :width="l.m.w" :height="l.m.h" :stroke="l.color" />
          <polyline :points="l.arrow" :stroke="l.color" :marker-end="`url(#${arrowId}-${l.name})`" />
          <text :x="l.x" :y="l.labelY" :fill="l.color" class="class-name">{{ l.name }}</text>
        </template>
      </g>
      <g class="reveal" :class="{ on: reached(6) && !reached(8) }" :style="squash">
        <polyline :points="out.arrows.transcription" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <TextPanel
          :x="S.oX" :cy="out.cy.transcription" :width="S.TW" :scale="scale" :blocks="transcriptionBlocks"
          :words="transcriptionWords" :font="FOCUS_LOOK[0]" :pad="FOCUS_LOOK[1]" @box="outBoxes.transcription = $event"
        />
      </g>
      <g class="reveal" :class="{ on: reached(7) && !reached(8) }" :style="squash">
        <polyline :points="out.arrows.records" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <TextPanel
          :x="S.oX" :cy="out.cy.records" :width="S.TW" :scale="scale" :blocks="recordsBlocks"
          :words="recordsWords" mono :font="RECORDS_FONT" :pad="6" @box="outBoxes.records = $event"
        />
      </g>
      <g class="reveal" :class="{ on: reached(8) }">
        <polyline :points="`${prRight},${S.mid} ${S.oX},${S.mid}`" fill="none" :stroke="NAVY" stroke-width="0.8" :marker-end="`url(#${arrowId})`" />
        <image href="/figures/classification.png" :x="S.oX" :y="S.mid - IMAGE_HEIGHT / 2" :width="S.TW" :height="IMAGE_HEIGHT" />
        <rect :x="S.oX" :y="S.mid - IMAGE_HEIGHT / 2" :width="S.TW" :height="IMAGE_HEIGHT" fill="none" :stroke="NAVY" stroke-width="0.25" />
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
.class-name {
  font-weight: bold;
  font-size: 10px;
}
</style>
