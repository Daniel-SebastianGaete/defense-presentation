import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'
import { useNav } from '@slidev/client'
import { useMagicKeys } from '@vueuse/core'

// Ctrl+Right goes to the cover of the next section and Ctrl+Left to the start of the section the
// slide belongs to (or, from a cover, to the previous section's). A section is a slide with
// `layout: section`; nothing happens when there is no such cover in that direction.
export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  const { slides, currentSlideNo } = useNav()
  const { ctrl } = useMagicKeys()

  const covers = () => slides.value.filter(s => s.meta?.layout === 'section').map(s => s.no)
  const nextSection = () => {
    const no = covers().find(n => n > currentSlideNo.value)
    if (no)
      nav.go(no)
  }
  const prevSection = () => {
    const no = covers().reverse().find(n => n < currentSlideNo.value)
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
