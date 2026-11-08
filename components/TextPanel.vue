<script setup lang="ts">
// A rectangle of text inside the architecture svg, in the style of the diagram's
// boxes: `blocks` are the cells it is divided into (one, or one per sentence), laid
// out in px at 1x and scaled into the figure (by `scale`) so that Chrome's minimum
// font size does not apply. It is as tall as its text, which is measured, and
// centred on `cy`. With `marks`, every redaction marker is found by measuring the
// text, and reported (`outlines`, in figure units) for the parent to outline. With `swap`, every
// marker can turn into a word of its own (once `swapped`): the marker fades into it while the
// text after it makes room, and the panel follows the text to its new height. With `words`, the
// markers of all the cells are those words from the start.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  x: number
  cy: number
  width: number
  scale: number
  blocks: string[]
  marks?: boolean
  font?: number // px
  pad?: number // px, above and below each cell
  colors?: string[] // the background of each cell, once `colorsOn`
  colorsOn?: boolean
  shown?: boolean[] // which cells are meant to be there; the others go (see `play`)
  swap?: { text: string, color: string }[] // what each marker turns into, in order
  swapped?: boolean
  words?: { text: string, color: string }[] // what each marker of the text is drawn as, in order, from the start
  mono?: boolean // the text is code: monospaced, with its lines and spaces as they are
  reveal?: boolean[] // which cells are there; when it changes the cells are added (or taken away) and the panel grows (or shrinks) to the text
}>()

const NAVY = '#000080'
const FILL = '#ebebf5'
const MARK = '*****'
const LINE = 1.35
const font = computed(() => props.font ?? 9)
const pad = computed(() => props.pad ?? 7)

const emit = defineEmits<{
  outlines: [rects: { x: number, y: number, w: number, h: number }[]]
  box: [box: { y: number, h: number }] // where the panel is, in figure units
}>()

const div = ref<HTMLElement | null>(null)
const spans: HTMLElement[] = []
const news: HTMLElement[] = [] // the words the markers turn into
const measured = ref<number | null>(null) // height, in figure units
const found = ref<{ l: number, t: number, r: number, b: number }[]>([])

// Until the text is measured: a guess from its length (about 0.46 em a character).
const guess = computed(() => {
  const room = props.width * props.scale - 16
  const lines = props.blocks.reduce((n, b) => n + Math.max(1, Math.ceil((b.length * 0.46 * font.value) / room)), 0)
  return (lines * font.value * LINE + 2 * pad.value * props.blocks.length) / props.scale
})
const height = computed(() => measured.value ?? guess.value)
// Cells that are not shown go in four steps:
//   1 they are cut off: they vanish and the panel is cut short where they were, its top staying
//     where it is, 2 the text of the ones left fades out, 3 the panel takes its final size and
//     place (the text size changes now, unseen, and the panel takes the colour of the cells left)
//     and 4 the text fades in again.
// Going back is the same the other way round. What is on screen is kept apart from what is meant
// to be (`target`), and `play` takes the one to the other.
const target = computed(() => props.shown ?? props.blocks.map(() => true))
const focused = computed(() => target.value.some(v => !v))
const inLayout = ref<boolean[]>([...(props.reveal ?? target.value)]) // the cells that are there
const textHidden = ref(false)
const fillOn = ref(focused.value) // the panel has the colour of the cells left
const live = ref({ font: props.font ?? 9, pad: props.pad ?? 7 })
const easing = ref(false) // the panel's size and place are allowed to take their time
const pinnedTop = ref<number | null>(null) // where the top stays while the panel is cut short
let fullTop: number | null = null // where the top was before the cut
const timers: ReturnType<typeof setTimeout>[] = []
const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
// Changes what is there and measures the result before anything is drawn.
async function change(fn: () => void) {
  fn()
  await nextTick()
  measure()
}
watch(focused, (f) => {
  timers.forEach(clearTimeout)
  timers.length = 0
  if (f) {
    fullTop = top.value
    void change(() => {
      pinnedTop.value = fullTop
      inLayout.value = [...target.value]
    })
    at(400, () => { textHidden.value = true })
    at(750, () => {
      live.value = { font: props.font ?? 9, pad: props.pad ?? 7 }
      pinnedTop.value = null
      easing.value = true
      fillOn.value = true
    })
    at(1400, () => { textHidden.value = false })
    at(1450, () => { easing.value = false })
  }
  else {
    textHidden.value = true
    at(300, () => {
      live.value = { font: props.font ?? 9, pad: props.pad ?? 7 }
      pinnedTop.value = fullTop ?? props.cy - guess.value / 2
      easing.value = true
    })
    at(950, () => {
      easing.value = false
      textHidden.value = false
      fillOn.value = false
    })
    at(1400, () => {
      void change(() => {
        inLayout.value = [...target.value]
        pinnedTop.value = null
      })
    })
  }
})
const fontNow = computed(() => (props.shown ? live.value.font : font.value))
const padNow = computed(() => (props.shown ? live.value.pad : pad.value))
const fillColor = computed(() => (fillOn.value && props.colors ? props.colors[target.value.indexOf(true)] : FILL))
const ease = computed(() => (easing.value ? 'height 0.6s ease, y 0.6s ease' : 'none'))
const top = computed(() => pinnedTop.value ?? props.cy - height.value / 2)
const fillStyle = computed(() => ({ height: `${height.value}px`, y: `${top.value}px`, fill: fillColor.value, transition: `${ease.value === 'none' ? '' : `${ease.value}, `}fill 0.4s` }))
const boxStyle = computed(() => ({ height: `${height.value}px`, y: `${top.value}px`, transition: ease.value }))
// The first cell there is has no border above it, whichever cell it is.
const firstShown = computed(() => inLayout.value.indexOf(true))
// How many markers the cells before each one have, to tell which word a marker takes.
const markersBefore = computed(() => props.blocks.map((_, i) => props.blocks.slice(0, i).reduce((n, b) => n + b.split(MARK).length - 1, 0)))

// Markers turning into words: each marker is as wide as it is, or as the word that takes its place
// (`widths`, measured), and that width takes its time to change, which is what makes the text after
// it slide. The text can change height on the way (a line more or less), so the panel is measured
// every frame until it settles and its size eases. Nothing is animated until the panel has been
// measured once (`ready`), so a panel that starts out swapped just is.
const flipped = ref(!!props.swapped)
const ready = ref(false)
const widths = ref<{ from: number, to: number }[]>([])
// A marker that is not laid out (in a cell that is not there) has no width to hold on to.
const swapStyle = (j: number) => {
  const w = widths.value[j]
  return w && w.to > 0 ? { width: `${flipped.value ? w.to : w.from}px` } : undefined
}
let frame = 0
let settle: ReturnType<typeof setTimeout> | undefined
function track(ms: number) {
  cancelAnimationFrame(frame)
  const end = performance.now() + ms
  const step = () => {
    measure()
    if (performance.now() < end)
      frame = requestAnimationFrame(step)
  }
  step()
}
watch(() => props.swapped, (s) => {
  flipped.value = !!s
  easing.value = true
  track(1200)
  clearTimeout(settle)
  settle = setTimeout(() => { easing.value = false }, 1200)
})
// Cells added (or taken away) all at once: the text stays where it is and the panel, as tall as its
// text, eases to the size it takes, so the new cells show as it grows.
watch(() => props.reveal, async (r) => {
  if (!r || r.every((v, i) => v === inLayout.value[i]))
    return
  easing.value = true
  inLayout.value = [...r]
  await nextTick()
  track(1200)
  clearTimeout(settle)
  settle = setTimeout(() => { easing.value = false }, 1200)
})

function measure() {
  const d = div.value
  if (!d || !d.offsetWidth)
    return
  const dr = d.getBoundingClientRect()
  const px = dr.width / d.offsetWidth
  measured.value = d.offsetHeight / props.scale
  if (props.marks) {
    // The markers of the cells that are not there have no box.
    found.value = spans.flatMap((e) => {
      const r = e?.getClientRects()[0]
      return r ? [{ l: (r.left - dr.left) / px, t: (r.top - dr.top) / px, r: (r.right - dr.left) / px, b: (r.bottom - dr.top) / px }] : []
    })
  }
  if (props.swap)
    widths.value = spans.map((e, j) => (e && news[j] ? { from: e.getBoundingClientRect().width / px, to: news[j].getBoundingClientRect().width / px } : undefined)) as typeof widths.value
}

// Side by side markers are one space (2.75 px) apart, so the sides get less room than the top and bottom.
const PAD_X = 1
const PAD_Y = 1.5
const outlines = computed(() =>
  found.value.map(r => ({
    x: props.x + (r.l - PAD_X) / props.scale,
    y: top.value + (r.t - PAD_Y) / props.scale,
    w: (r.r - r.l + 2 * PAD_X) / props.scale,
    h: (r.b - r.t + 2 * PAD_Y) / props.scale,
  })),
)

watch(outlines, o => emit('outlines', o), { immediate: true })
watch([top, height], ([y, h]) => emit('box', { y, h }), { immediate: true })

let ro: ResizeObserver | undefined
watch(div, (d) => {
  ro?.disconnect()
  if (d && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    ro.observe(d)
  }
})
onMounted(() => {
  nextTick(measure)
  document.fonts?.ready.then(measure)
  setTimeout(measure, 300)
  setTimeout(() => { ready.value = true }, 350)
  setTimeout(measure, 1200)
})
onBeforeUnmount(() => { ro?.disconnect(); timers.forEach(clearTimeout); clearTimeout(settle); cancelAnimationFrame(frame) })
</script>

<template>
  <g>
    <rect :x="x" :y="top" :width="width" :height="height" :style="fillStyle" rx="3" :fill="FILL" :stroke="NAVY" stroke-width="0.8" />
    <foreignObject :x="x" :y="top" :width="width" :height="height" :style="boxStyle">
      <div ref="div" class="panel-text" :class="{ 'text-hidden': textHidden, swapped: flipped, anim: ready, mono }" :style="{ width: `${width * scale}px`, transform: `scale(${1 / scale})`, fontSize: `${fontNow}px`, borderRadius: `${3 * scale}px` }">
        <div v-for="(b, i) in blocks" :key="i" class="cell" :class="{ gone: !inLayout[i], first: i === firstShown }" :style="{ backgroundColor: colorsOn && colors && !fillOn ? colors[i] : 'transparent' }">
          <div class="body" :style="{ padding: `${padNow}px 8px` }">
            <template v-if="marks || words"><template v-for="(p, j) in b.split(MARK)" :key="j">{{ p }}<template v-if="j < b.split(MARK).length - 1"><span v-if="words" class="word" :style="{ color: words[markersBefore[i] + j]?.color }">{{ words[markersBefore[i] + j]?.text }}</span><span v-else-if="swap" class="swap" :style="swapStyle(markersBefore[i] + j)"><span class="old" :ref="(e) => { spans[markersBefore[i] + j] = e as HTMLElement }">{{ MARK }}</span><span class="new" :ref="(e) => { news[markersBefore[i] + j] = e as HTMLElement }" :style="{ color: swap[markersBefore[i] + j]?.color }">{{ swap[markersBefore[i] + j]?.text }}</span></span><span v-else :ref="(e) => { spans[markersBefore[i] + j] = e as HTMLElement }">{{ MARK }}</span></template></template></template>
            <template v-else>{{ b }}</template>
          </div>
        </div>
      </div>
    </foreignObject>
    <rect v-if="colors" :x="x" :y="top" :width="width" :height="height" :style="boxStyle" rx="3" fill="none" :stroke="NAVY" stroke-width="0.8" />
  </g>
</template>

<style scoped>
.panel-text {
  box-sizing: border-box;
  transform-origin: 0 0;
  overflow: hidden;
  color: #000;
  line-height: 1.35; /* LINE */
  text-align: left;
}
.cell {
  transition: background-color 0.4s;
}
.cell + .cell {
  border-top: 1.4px solid #000080;
}
.cell + .cell.first {
  border-top-width: 0;
}
/* A cell that is not shown is cut off. */
.cell.gone {
  display: none;
}
.body {
  transition: opacity 0.3s;
}
.text-hidden .body {
  opacity: 0;
}
.mono {
  font-family: var(--slidev-code-font-family, monospace);
  white-space: pre;
}
.word {
  font-weight: bold;
}
/* A marker that can turn into a word: the marker stays in the flow, the word is laid over it. */
.swap {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.new {
  position: absolute;
  left: 0;
  top: 0;
  font-weight: bold;
  opacity: 0;
}
.swapped .old {
  opacity: 0;
}
.swapped .new {
  opacity: 1;
}
.anim .swap {
  transition: width 0.5s ease;
}
.anim .old,
.anim .new {
  transition: opacity 0.4s;
}
/* The markers wait a moment before they turn into words (and do not when they turn back). */
.anim.swapped .swap,
.anim.swapped .old,
.anim.swapped .new {
  transition-delay: 0.25s;
}
</style>
