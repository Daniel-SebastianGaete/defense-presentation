<script setup lang="ts">
// The list of the sections of the talk, as the Contents slide draws it, with the section `active` (1-based)
// in focus and all the others greyed out. It heads the slide that comes before each section cover.
defineProps<{ active: number }>()

const SECTIONS = ['Introduction', 'Related work', 'Method', 'Experiments', 'Case study', 'Discussion', 'Conclusion']
</script>

<template>
  <ol class="focus">
    <li v-for="(section, i) in SECTIONS" :key="section" :class="{ on: i + 1 === active }">
      {{ section }}
    </li>
  </ol>
</template>
