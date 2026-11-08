<script setup lang="ts">
// Positions images / text boxes on a canvas measured in cm (the unit the
// workshop TikZ diagrams used), draws arrows between them, and reveals each
// node or arrow once `step` reaches its `from` / `at` value (the equivalent of
// the TikZ overlay specs `<2->`). Pass `:step="$clicks + 1"` for animation and
// set `clicks: N` in the slide frontmatter.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface SceneNode {
  id: string
  x: number
  y: number
  from?: number
  img?: string
  h?: number
  w?: number
  kind?: 'box' | 'mono'
  text?: string
  tw?: number
  size?: number
  label?: string
}
interface SceneEdge {
  from: string
  to: string
  at?: number
}
interface Box {
  l: number
  r: number
  t: number
  b: number
}

const props = defineProps<{
  bbox: number[]
  nodes: SceneNode[]
  edges?: SceneEdge[]
  step?: number
  highlight?: string
  scale?: number
}>()

const S = computed(() => props.scale ?? 55)
const step = computed(() => props.step ?? 999)
const width = computed(() => (props.bbox[2] - props.bbox[0]) * S.value)
const height = computed(() => (props.bbox[3] - props.bbox[1]) * S.value)
const uid = `arrow-${Math.random().toString(36).slice(2)}`

const root = ref<HTMLElement | null>(null)
const els = new Map<string, HTMLElement>()
const geo = ref<Record<string, Box>>({})

function setEl(id: string, el: unknown) {
  if (el) els.set(id, el as HTMLElement)
}

// The slide is scaled with a CSS transform, so measure in screen space and
// divide by the scale factor to get canvas pixels.
function measure() {
  const r = root.value
  if (!r)
    return
  const rr = r.getBoundingClientRect()
  const k = rr.width / r.offsetWidth || 1
  const g: Record<string, Box> = {}
  for (const [id, el] of els) {
    const b = el.getBoundingClientRect()
    g[id] = {
      l: (b.left - rr.left) / k,
      r: (b.right - rr.left) / k,
      t: (b.top - rr.top) / k,
      b: (b.bottom - rr.top) / k,
    }
  }
  geo.value = g
}

let ro: ResizeObserver | undefined
onMounted(() => {
  nextTick(measure)
  setTimeout(measure, 300)
  setTimeout(measure, 1200)
  if (root.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    ro.observe(root.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())

// An image path of the slides (`/figures/...`), under the base the deck is served from (a repository
// site is served from `/<repository>/`, and a path that is not a plain `src` is not prefixed by the build).
const withBase = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')

function place(n: SceneNode) {
  return {
    left: `${(n.x - props.bbox[0]) * S.value}px`,
    top: `${(props.bbox[3] - n.y) * S.value}px`,
  }
}
function imgStyle(n: SceneNode) {
  const s: Record<string, string> = { maxWidth: 'none' }
  if (n.h)
    s.height = `${n.h * S.value}px`
  if (n.w) {
    s.width = `${n.w * S.value}px`
    s.objectFit = 'contain'
  }
  return s
}
function textStyle(n: SceneNode) {
  const s: Record<string, string> = {}
  if (n.tw)
    s.width = `${n.tw * S.value}px`
  if (n.size)
    s.fontSize = `${n.size}em`
  return s
}
function line(e: SceneEdge) {
  const a = geo.value[e.from]
  const b = geo.value[e.to]
  if (!a || !b)
    return null
  return { x1: a.r, y1: (a.t + a.b) / 2, x2: b.l, y2: (b.t + b.b) / 2 }
}
const hl = computed(() => {
  const g = props.highlight ? geo.value[props.highlight] : undefined
  if (!g)
    return null
  const pad = 8
  return { x: g.l - pad, y: g.t - pad, w: g.r - g.l + 2 * pad, h: g.b - g.t + 2 * pad }
})
</script>

<template>
  <div ref="root" class="scene" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg class="overlay" :width="width" :height="height">
      <defs>
        <marker :id="uid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <template v-for="(e, i) in edges ?? []" :key="i">
        <line
          v-if="line(e)"
          class="edge"
          :class="{ off: step < (e.at ?? 1) }"
          v-bind="line(e)!"
          stroke="currentColor"
          stroke-width="2"
          :marker-end="`url(#${uid})`"
        />
      </template>
      <rect
        v-if="hl"
        :x="hl.x"
        :y="hl.y"
        :width="hl.w"
        :height="hl.h"
        rx="8"
        fill="none"
        stroke="#d33"
        stroke-width="3"
      />
    </svg>
    <div
      v-for="n in nodes"
      :key="n.id"
      :ref="(el) => setEl(n.id, el)"
      class="node"
      :class="{ off: step < (n.from ?? 1) }"
      :style="place(n)"
    >
      <span v-if="n.label" class="label">{{ n.label }}</span>
      <img v-if="n.img" :src="withBase(n.img)" :style="imgStyle(n)" @load="measure">
      <div v-else-if="n.kind === 'mono'" class="mono" :style="textStyle(n)" v-html="n.text" />
      <div v-else class="box" :style="textStyle(n)">
        {{ n.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  margin: 0 auto;
}
.overlay {
  position: absolute;
  inset: 0;
  overflow: visible;
}
.node {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s;
}
.node img {
  display: block;
  margin: 0;
}
.off {
  opacity: 0;
}
.edge {
  transition: opacity 0.2s;
}
.label {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 4px;
  font-size: 0.7em;
  white-space: nowrap;
}
.box {
  border: 2px solid currentColor;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  font-size: 0.8em;
}
.mono {
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 6px;
  text-align: left;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.5em;
}
</style>
