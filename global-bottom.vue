<!--
  Drawn on top of every slide, outside the slide transitions, so it stays put while the slides change:
  an orange bar along the bottom edge, and above it the number of the slide, in the bottom-right corner.
-->
<template>
  <div class="theme-bar" />
  <div class="slide-number">{{ $nav.currentPage }}</div>
</template>

<style scoped>
.theme-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 12px;
  background: #f57c00;
  pointer-events: none;
}

.slide-number {
  position: absolute;
  right: 1.25rem;
  bottom: 1.4rem;
  font-size: 0.85rem;
  line-height: 1;
  color: #6b7280;
}
</style>
