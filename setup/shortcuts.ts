import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'
import { useNav } from '@slidev/client'
import { useMagicKeys } from '@vueuse/core'

// Ctrl+Right goes to the start of the next section and Ctrl+Left to the start of the section the
// slide belongs to (or, from a start, to the previous section's). The first slide is the first start,
// a numbered section starts at its Contents slide (the slide titled "Contents"), and the
// complementary material at its cover (`layout: section`); nothing happens when there is no such
// slide in that direction.
export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  const { slides, currentSlideNo } = useNav()
  const { ctrl } = useMagicKeys()

  const starts = () => slides.value
    .filter(s => s.no === 1 || s.meta?.slide?.title === 'Contents' || s.meta?.layout === 'section')
    .map(s => s.no)
  const nextSection = () => {
    const no = starts().find(n => n > currentSlideNo.value)
    if (no)
      nav.go(no)
  }
  const prevSection = () => {
    const no = starts().reverse().find(n => n < currentSlideNo.value)
    if (no)
      nav.go(no)
  }

  // The built-in Right and Left also fire with Ctrl held, and would advance a click as well.
  const withoutCtrl = (s: ShortcutOptions): ShortcutOptions => {
    const fn = s.fn
    return fn ? { ...s, fn: () => { if (!ctrl.value) fn() } } : s
  }

  return [
    ...base.map(s => (s.name === 'next_right' || s.name === 'prev_left') ? withoutCtrl(s) : s),
    { name: 'next_section', key: 'ctrl+right', fn: nextSection },
    { name: 'prev_section', key: 'ctrl+left', fn: prevSection },
  ]
})
