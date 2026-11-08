<script setup lang="ts">
// The figure area of a slide in the architecture zoom sequence: draws `view` of
// Figure 4.1 and carries the transforms the zoom transitions need (see
// styles/index.css): `next`/`prev` name the neighbouring slide's view when that
// one is a close-up of this one. `stage` says that the slide before (or after)
// is the stage this close-up belongs to, so its extras (`.extra`) can be faded
// around the zoom. `step` is the click count, for close-ups that
// build up. `ask` names a box (by id) that step 1 puts in question, and `answer` is the text
// (one string per line) that step 2 puts in its place; step 3 takes the red rectangle off. `settled`
// maps the boxes that an earlier slide already answered to their answer. `build` makes the whole figure
// draw itself with the click count (`step`): the input, then each stage, fading in. `frames` lists boxes (by id)
// that get a red rectangle, one more at each step.
import { computed } from 'vue'
import Architecture from './Architecture.vue'
import { VIEWS, zoomTransform } from './architecture-views'

const props = defineProps<{ view?: string, next?: string, prev?: string, step?: number, stage?: 'before' | 'after', ask?: string, answer?: string[], settled?: Record<string, string[]>, build?: boolean, frames?: string[] }>()

const style = computed(() => {
  const here = VIEWS[props.view ?? 'full']
  const vars: Record<string, string> = {}
  if (props.next)
    vars['--zoom-in-t'] = zoomTransform(here, VIEWS[props.next])
  if (props.prev)
    vars['--zoom-out-t'] = zoomTransform(here, VIEWS[props.prev])
  return vars
})
</script>

<template>
  <div class="zoom-clip">
    <div class="zoom-figure" :style="style" :data-stage="stage">
      <Architecture :view="view" :step="step" :ask="ask" :answer="answer" :settled="settled" :build="build" :frames="frames" style="max-height: 380px" />
    </div>
  </div>
</template>
